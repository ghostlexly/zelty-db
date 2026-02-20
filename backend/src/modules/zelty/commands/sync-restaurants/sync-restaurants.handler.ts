import { ZeltyService } from '../../zelty.service';
import { AxiosError, AxiosInstance } from 'axios';
import { Injectable, Logger } from '@nestjs/common';
import { DatabaseService } from '../../../shared/services/database.service';

@Injectable()
export class SyncRestaurantsHandler {
  private logger = new Logger(SyncRestaurantsHandler.name);
  private readonly client: AxiosInstance;

  constructor(
    private readonly db: DatabaseService,
    private readonly zeltyService: ZeltyService,
  ) {
    this.client = zeltyService.getClient();
  }

  async execute() {
    try {
      const data = await this.client
        .get('restaurants')
        .then((res) => res.data.restaurants);

      for (const restaurant of data) {
        const restaurantData = {
          remoteId: restaurant.remote_id,
          disable: restaurant.disable,
          name: restaurant.name,
          description: restaurant.description,
          countryCode: restaurant.country_code,
          currency: restaurant.currency,
          image: restaurant.image || null,
          defaultLang: restaurant.default_lang,
          productionDelay: restaurant.production_delay,
          deliveryTime: restaurant.delivery_time,
          orderingAvailable: restaurant.ordering_available,
          deliveryCharge: restaurant.delivery_charge,
          deliveryChargeTva: restaurant.delivery_charge_tva,
          deliveryMinimum: restaurant.delivery_minimum,
          deliveryNoChargeMin: restaurant.delivery_no_charge_min,
          deliveryHours: restaurant.delivery_hours,
          openingHours: restaurant.opening_hours,
          openingHoursTxt: restaurant.opening_hours_txt,
          happyHours: restaurant.happy_hours,
          closures: restaurant.closures ?? [],
          address: restaurant.address,
          phone: restaurant.phone,
          publicName: restaurant.public_name,
          onlineOrderingHidden: restaurant.online_ordering_hidden,
          latitude: restaurant.loc?.lat,
          longitude: restaurant.loc?.lng,
          takeawayDelay: restaurant.takeaway_delay,
          orderingDelay: restaurant.ordering_delay,
          delay: restaurant.delay,
          meta: restaurant.meta,
        };

        await this.db.prisma.zeltyRestaurant.upsert({
          where: {
            zeltyId: restaurant.id,
          },
          create: {
            zeltyId: restaurant.id,
            ...restaurantData,
          },
          update: restaurantData,
        });
      }
    } catch (err) {
      if (err instanceof AxiosError) {
        this.logger.error(
          `Failed to sync restaurants: ${err.response?.status ?? 'No response'} - ${err.message}`,
        );
      } else {
        this.logger.error('Failed to sync restaurants', err.stack);
      }

      throw err;
    }
  }
}
