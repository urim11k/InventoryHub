// Database Service (src/services/inventoryService.js)
class InventoryService {
    constructor(db) {
        this.db = db;
    }

    async list({ page, limit, search, sort }) {
        // Build efficient query
        const query = this.db('inventory')
            .select([
                'id',
                'name',
                'quantity',
                'last_updated'
            ]);

        // Optimize search with indexes
        if (search) {
            query.whereILike('name', `%${search}%`)
                 .orWhereILike('sku', `%${search}%`);
        }

        // Efficient pagination
        const offset = (page - 1) * limit;
        const [items, total] = await Promise.all([
            query.clone()
                .orderBy(sort?.field || 'last_updated', sort?.order || 'desc')
                .offset(offset)
                .limit(limit),
            query.clone().count('* as count').first()
        ]);

        return {
            items,
            total: parseInt(total.count),
            page,
            hasNext: offset + items.length < total.count
        };
    }
}