import { Injectable, Logger } from '@nestjs/common';
import { DatabaseService } from '../../../shared/services/database.service';
import { ZeltyService } from '../../zelty.service';
import { AxiosError, AxiosInstance } from 'axios';

const PAGE_LIMIT = 100;

@Injectable()
export class SyncDishesHandler {
  private logger = new Logger(SyncDishesHandler.name);
  private readonly client: AxiosInstance;

  constructor(
    private readonly db: DatabaseService,
    private readonly zeltyService: ZeltyService,
  ) {
    this.client = zeltyService.getClient();
  }

  async execute() {
    try {
      let offset = 0;
      let totalSynced = 0;

      while (true) {
        const data = await this.client
          .get('catalog/dishes', {
            params: {
              limit: PAGE_LIMIT,
              offset,
              show_all: true,
              all_restaurants: true,
            },
          })
          .then((res) => res.data.dishes);

        if (!data || data.length === 0) {
          break;
        }

        for (const dish of data) {
          const dishData = {
            zeltyRestaurantId: dish.id_restaurant,
            remoteId: dish.remote_id ?? null,
            sku: dish.sku ?? null,
            name: dish.name,
            description: dish.description ?? null,
            image: dish.image || null,
            thumb: dish.thumb || null,
            price: dish.price ?? 0,
            priceTogo: dish.price_togo ?? null,
            priceDelivery: dish.price_delivery ?? null,
            happyPrice: dish.happy_price ?? null,
            costPrice: dish.cost_price ?? null,
            tax: dish.tax ?? 0,
            taxTakeaway: dish.tax_takeaway ?? null,
            taxDelivery: dish.tax_delivery ?? null,
            tags: dish.tags ?? [],
            options: dish.options ?? [],
            fabricationPlaceId: dish.id_fabrication_place ?? null,
            color: dish.color ?? null,
            loyaltyPoints: dish.loyalty_points ?? 0,
            earnLoyalty: dish.earn_loyalty ?? 0,
            priceToDefine: dish.price_to_define ?? false,
            disable: dish.disable ?? false,
            disableTakeaway: dish.disable_takeaway ?? false,
            disableDelivery: dish.disable_delivery ?? false,
            meta: dish.meta ?? null,
          };

          await this.db.prisma.zeltyDish.upsert({
            where: { zeltyId: dish.id },
            create: {
              zeltyId: dish.id,
              ...dishData,
            },
            update: dishData,
          });
        }

        totalSynced += data.length;
        this.logger.debug(
          `Synced ${data.length} dishes (total: ${totalSynced})`,
        );

        if (data.length < PAGE_LIMIT) {
          break;
        }

        offset += PAGE_LIMIT;

        await new Promise((resolve) => setTimeout(resolve, 5_000));
      }

      this.logger.log(`Successfully synced ${totalSynced} dishes`);
    } catch (err) {
      if (err instanceof AxiosError) {
        this.logger.error(
          `Failed to sync dishes: ${err.response?.status ?? 'No response'} - ${err.message}`,
        );
      } else {
        this.logger.error('Failed to sync dishes', err.stack);
      }

      throw err;
    }
  }
}
