import EmailSchema from "../models/emailSchema.js"

export const create = async (data) => {
    try {
        const newEmail = new EmailSchema(data);
        const savedEmail = await newEmail.save();
        return savedEmail;
    } catch (error) {
        throw new Error("Failed to schedule email");
    }
};

export const findAll = async (options) => {
    try {
        const { search, sort, filter, page, limit } = options;

        const filterConditions = {};
        if (filter !== 'all') {
            filterConditions.status = filter;
        }

        const query = {
            toEmail: { $regex: search, $options: 'i' },
            ...filterConditions,
        };

        const skip = (page - 1) * limit;

        const pipeline = [
            { $match: query },
            { $sort: sort === 'latest' ? { createdAt: -1 } : { createdAt: 1 } },
            { $skip: skip },
            { $limit: limit },
        ];

        const countPipeline = [
            { $match: query },
            { $count: 'totalCount' },
        ];

        const [emails, countResult] = await Promise.all([
            EmailSchema.aggregate(pipeline),
            EmailSchema.aggregate(countPipeline),
        ]);

        const totalCount = countResult.length > 0 ? countResult[0].totalCount : 0;

        return { emails, totalCount };
    } catch (error) {
        throw new Error("Failed to fetch emails");
    }
};

export const findById = async (id) => {
    try {
        const email = await EmailSchema.findById(id);
        return email;
    } catch (error) {
        throw new Error("Failed to find email by ID");
    }
};

export const update = async (id, newData) => {
    try {
        const updatedEmail = await EmailSchema.findOneAndUpdate({_id: id, status: "pending"}, newData, { new: true });
        return updatedEmail;
    } catch (error) {
        throw new Error("Failed to update email");
    }
};

export const remove = async (id) => {
    try {
        const deletedEmail = await EmailSchema.findOneAndDelete({
            _id: id,
            $or: [{ status: "pending" }, { status: "failed" }]
        });
        return deletedEmail;
    } catch (error) {
        throw new Error("Failed to delete email");
    }
};