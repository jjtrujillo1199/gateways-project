/**
 * Seed script — generates gateway.db with 25 gateway records
 * Run with: npx ts-node seed.ts
 */
import { DataSource } from 'typeorm';
import { Gateway, GatewayType, GatewayStatus } from './src/gateways/entities/gateway.entity';
import { PaymentMethod } from './src/gateways/entities/payment-method.entity';
import { v4 as uuidv4 } from 'uuid';

const AppDataSource = new DataSource({
  type: 'sqljs',
  location: 'gateway.db',
  autoSave: true,
  synchronize: true,
  logging: false,
  entities: [Gateway, PaymentMethod],
});

const types = [GatewayType.CREDIT_CARD, GatewayType.BANK_TRANSFER, GatewayType.CRYPTO];
const statuses = [GatewayStatus.ACTIVE, GatewayStatus.INACTIVE, GatewayStatus.MAINTENANCE];
const countries = ['CO', 'US', 'MX', 'BR', 'AR', 'PE', 'CL', 'EC', 'UY', 'VE'];

const gatewayNames = [
  'Stripe CO', 'PayU Colombia', 'MercadoPago', 'ePayco', 'Wompi',
  'PayPal MX', 'Conekta', 'OpenPay', 'Clip', 'Kushki',
  'PlacetoPay', 'PSE Gateway', 'Davivienda Pay', 'Bancolombia PSE', 'Nequi Business',
  'Binance Pay', 'CryptoGate', 'BitPay', 'Coinbase Commerce', 'NowPayments',
  'Adyen LATAM', 'Worldpay BR', 'SafetyPay AR', 'Getnet CL', 'Transbank',
];

const methodNames = [
  ['Visa', 'Mastercard', 'Amex'],
  ['PSE', 'ACH Transfer', 'Wire'],
  ['BTC', 'ETH', 'USDT', 'BNB'],
  ['Visa Débito', 'Mastercard Débito'],
  ['Efectivo', 'Nequi', 'Daviplata'],
];

async function seed() {
  await AppDataSource.initialize();
  console.log('📦 Conexión SQLite establecida');

  const gatewayRepo = AppDataSource.getRepository(Gateway);

  // Clear existing data
  await AppDataSource.query('DELETE FROM payment_methods');
  await AppDataSource.query('DELETE FROM gateways');
  console.log('🗑️  Datos anteriores eliminados');

  for (let i = 0; i < 25; i++) {
    const type = types[i % types.length];
    const status = statuses[i % statuses.length];
    const country = countries[i % countries.length];

    // Pick relevant payment methods based on type
    let pmPool: string[];
    if (type === GatewayType.CREDIT_CARD) pmPool = methodNames[0];
    else if (type === GatewayType.BANK_TRANSFER) pmPool = methodNames[1];
    else pmPool = methodNames[2];

    const pmCount = Math.min(pmPool.length, (i % 3) + 1);
    const paymentMethods = pmPool.slice(0, pmCount).map((name) => ({
      name,
      commissionRate: parseFloat((Math.random() * 4 + 0.5).toFixed(2)),
    }));

    const gateway = gatewayRepo.create({
      name: gatewayNames[i],
      type,
      status,
      country,
      commissionRate: parseFloat((Math.random() * 5 + 0.5).toFixed(2)),
      paymentMethods: paymentMethods as any,
    });

    await gatewayRepo.save(gateway);
    console.log(`✅ ${i + 1}/25 — ${gateway.name} (${country}, ${type}, ${status})`);
  }

  console.log('\n🎉 Seed completado. Archivo: gateway.db');
  await AppDataSource.destroy();
}

seed().catch((err) => {
  console.error('❌ Error en seed:', err);
  process.exit(1);
});
