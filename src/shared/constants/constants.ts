export const MAX_FILE_SIZE = 10 * 1024 * 1024;

export const ALLOWED_IMAGE_MIME_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/svg+xml',
  'image/png',
];

export const DEFAULT_LIMIT = '10';
export const DEFAULT_OFFSET = '0';

export const WEBHOOK_EVENTS = {
  PAYMENT_AUTHORIZED: 'payment.authorized',
  PAYMENT_CAPTURED: 'payment.captured',
  ORDER_PAID: 'order.paid',
  PAYMENT_FAILED: 'payment.failed',
  PAYMENT_VOIDED: 'payment.voided',
  REFUND_CREATED: 'refund.created',
  REFUND_PROCESSED: 'refund.processed',
  REFUND_FAILED: 'refund.failed',
  SUBSCRIPTION_CHARGED: 'subscription.charged',
  SUBSCRIPTION_ACTIVATED: 'subscription.activated',
  SUBSCRIPTION_CANCELLED: 'subscription.cancelled',
  SUBSCRIPTION_UPDATED: 'subscription.updated',
  SUBSCRIPTION_COMPLETED: 'subscription.completed',
};
