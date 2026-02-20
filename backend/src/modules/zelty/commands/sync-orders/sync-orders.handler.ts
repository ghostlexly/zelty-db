import { Injectable, Logger } from '@nestjs/common';
import { DatabaseService } from '../../../shared/services/database.service';
import { ZeltyService } from '../../zelty.service';
import { AxiosError, AxiosInstance } from 'axios';
import { dateUtils } from '../../../core/utils/date';

const PAGE_LIMIT = 100;

@Injectable()
export class SyncOrdersHandler {
  private logger = new Logger(SyncOrdersHandler.name);
  private readonly client: AxiosInstance;

  constructor(
    private readonly db: DatabaseService,
    private readonly zeltyService: ZeltyService,
  ) {
    this.client = zeltyService.getClient();
  }

  async execute({ fromDate, toDate }: { fromDate?: Date; toDate?: Date } = {}) {
    try {
      let offset = 0;
      let totalSynced = 0;
      fromDate =
        fromDate ??
        dateUtils.sub(dateUtils.startOfMonth(new Date()), {
          days: 1,
        });
      toDate = toDate ?? dateUtils.endOfMonth(new Date());

      while (true) {
        const data = await this.client
          .get('orders', {
            params: {
              limit: PAGE_LIMIT,
              offset,
              from: dateUtils.format(fromDate, 'yyyy-MM-dd'),
              to: dateUtils.format(toDate, 'yyyy-MM-dd'),
              expand: 'items',
            },
          })
          .then((res) => res.data.orders);

        if (!data || data.length === 0) {
          break;
        }

        for (const order of data) {
          const orderData = {
            zeltyUuid: order.uuid,
            comment: order.comment ?? null,
            deviceId: order.device_id ?? null,
            closedByDeviceId: order.closed_by_device_id ?? null,
            remoteId: order.remote_id ?? null,
            ref: order.ref ?? null,
            loyalty: order.loyalty ?? 0,
            seats: order.seats ?? 1,
            tableNumber: order.table ?? null,
            zeltyRestaurantId: order.id_restaurant,
            zeltyCreatedAt: new Date(order.created_at as string),
            closedAt: order.closed_at
              ? new Date(order.closed_at as string)
              : null,
            dueDate: order.due_date ? new Date(order.due_date as string) : null,
            mode: order.mode ?? null,
            fulfillmentType: order.fulfillment_type ?? null,
            source: order.source ?? null,
            originName: order.origin_name ?? null,
            status: order.status,
            amountIncTax: order.price?.final_amount_inc_tax ?? 0,
            amountExcTax: order.price?.final_amount_exc_tax ?? 0,
            virtualBrandName: order.virtual_brand_name ?? null,
            firstName: order.first_name ?? null,
            phone: order.phone ?? null,
            buzzerRef: order.buzzer_ref ?? null,
            displayId: order.display_id ?? null,
          };

          await this.db.prisma.zeltyOrder.upsert({
            where: { zeltyId: order.id },
            create: {
              zeltyId: order.id,
              ...orderData,
            },
            update: orderData,
          });

          if (order.items && Array.isArray(order.items)) {
            for (const item of order.items) {
              const itemData = {
                zeltyOrderId: order.id,
                zeltyDishId: parseInt(item.item_id as string),
                name: item.name,
                type: item.type ?? 'dish',
                course: item.course ?? 0,
                comment: item.comment ?? null,
                baseOriginalAmountIncTax:
                  item.price?.base_original_amount_inc_tax ?? 0,
                originalAmountIncTax: item.price?.original_amount_inc_tax ?? 0,
                discountedAmountIncTax:
                  item.price?.discounted_amount_inc_tax ?? 0,
                finalAmountIncTax: item.price?.final_amount_inc_tax ?? 0,
                taxAmount: item.price?.tax?.tax_amount ?? 0,
                taxRate: item.price?.tax?.tax_rate ?? null,
                modifiers: item.modifiers ?? [],
              };

              await this.db.prisma.zeltyOrderItem
                .upsert({
                  where: { zeltyId: item.id },
                  create: {
                    zeltyId: item.id,
                    ...itemData,
                  },
                  update: itemData,
                })
                .catch((err) => {
                  this.logger.error(
                    `Error syncing zeltyOrderItem: ${err.message}`,
                    {
                      order_items: order.items,
                    },
                  );
                });
            }
          }
        }

        totalSynced += data.length;
        this.logger.debug(
          `Synced ${data.length} orders (total: ${totalSynced})`,
        );

        if (data.length < PAGE_LIMIT) {
          break;
        }

        offset += PAGE_LIMIT;

        await new Promise((resolve) => setTimeout(resolve, 5_000));
      }

      this.logger.log(`Successfully synced ${totalSynced} orders`);
    } catch (err) {
      if (err instanceof AxiosError) {
        this.logger.error(
          `Failed to sync orders: ${err.response?.status ?? 'No response'} - ${err.message}`,
        );
      } else {
        this.logger.error('Failed to sync orders', err.stack);
      }

      throw err;
    }
  }
}
