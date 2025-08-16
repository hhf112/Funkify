import { rateLimit } from "express-rate-limit"

export const limiter_hour = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 24H
  limit: 5,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  ipv6Subnet: 56,
})

export const limiter_minute = rateLimit({
  windowMs: 1000 * 60, // 1m
  limit: 2,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  ipv6Subnet: 56,
})

