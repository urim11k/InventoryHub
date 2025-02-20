// Backend API Controller (src/controllers/inventoryController.js)
const { Router } = require('express');
const router = Router();
const cache = require('../middleware/cache');
const { validateSchema } = require('../middleware/validation');
const inventorySchema = require('../schemas/inventory');

class InventoryController {
    constructor(inventoryService) {
        this.inventoryService = inventoryService;
        this.router = router;
        this.initializeRoutes();
    }

    initializeRoutes() {
        this.router.get(
            '/inventory',
            cache.middleware(300), // 5-minute cache
            validateSchema(inventorySchema.list),
            this.listInventory.bind(this)
        );
    }

    async listInventory(req, res, next) {
        try {
            const { page = 1, limit = 20, search, sort } = req.query;
            
            // Structured JSON response
            const result = await this.inventoryService.list({
                page: parseInt(page),
                limit: parseInt(limit),
                search,
                sort
            });

            res.json({
                data: result.items,
                metadata: {
                    total: result.total,
                    page: result.page,
                    totalPages: Math.ceil(result.total / limit)
                },
                links: {
                    self: `/inventory?page=${page}&limit=${limit}`,
                    next: result.hasNext ? `/inventory?page=${parseInt(page) + 1}&limit=${limit}` : null,
                    prev: page > 1 ? `/inventory?page=${parseInt(page) - 1}&limit=${limit}` : null
                }
            });
        } catch (error) {
            next(error);
        }
    }
}