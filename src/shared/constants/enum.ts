export enum ADDRESSTYPE {
  HOME = 'home',
  WORK = 'work',
  OTHER = 'other',
}

export enum DEVICE_TYPE {
  WEB = 'web',
  ANDROID = 'android',
  IOS = 'ios',
}

export enum DEFAULT_STATUS {
  ACTIVE = 'active',
  INACTIVE = 'in_active',
}

export enum PRODUCT_STATUS {
  ACTIVE = 'active',
  INACTIVE = 'in_active',
  SOLD = 'sold',
  ARCHIVED = 'archived',
}

export enum OTP_TYPE {
  SIGNUP = 'signup',
  LOGIN = 'login',
  FORGOT_PASSWORD = 'forgot_password',
  CHANGE_NUMBER = 'change_number',
}

export enum USER_TYPE {
  ARTIST = 'artist',
  CUSTOMER = 'customer',
}

export enum ORIENTATION {
  PORTRAIT = 'portrait',
  LANDSCAPE = 'landscape',
  SQUARE = 'square',
  CIRCULAR = 'circular',
}

export enum CUSTOM_REQUEST_STATUS {
  REQUESTED = 'requested',
  REPLIED = 'replied',
  ACCEPTED = 'accepted',
  ORDERED = 'ordered',
  REJECTED = 'rejected',
}

export enum MEDIA_FOLDER {
  default = 'default',
  products = 'products',
  profiles = 'profiles',
  banners = 'banners',
  categories = 'categories',
  order_receipts = 'order_receipts',
}

export enum ORDER_STATUS {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
  RETURNED = 'returned',
  FAILED = 'failed',
}

export enum PAYMENT_STATUS {
  PROCESSING = 'processing',
  SUCCESS = 'success',
  FAILED = 'failed',
  REFUND_PROCESSING = 'refund_processing',
  REFUNDED = 'refunded',
  VOIDED = 'voided',
}

export enum PAYMENT_METHOD {
  CARD = 'card',
  UPI = 'upi',
  NETBANKING = 'netbanking',
}

export enum REFUND_STATUS {
  INITIATED = 'initiated',
  PROCESSED = 'processed',
  FAILED = 'failed',
}
