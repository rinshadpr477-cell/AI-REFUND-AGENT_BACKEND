const fs = require('fs');
const path = require('path');

// Load mock data
const customersPath = path.join(__dirname, '../database/customers.json');
const policyPath = path.join(__dirname, '../database/refundPolicy.json');

const customers = JSON.parse(fs.readFileSync(customersPath, 'utf8'));
const policy = JSON.parse(fs.readFileSync(policyPath, 'utf8'));

const refundLogic = {
  processRefund: (customerId, amount, daysSincePurchase = 10) => {
    const logs = [];
    logs.push(' Step 1: Validating customer...');
    const customer = customers.find(c => c.id === customerId); 
    if (!customer) {
      logs.push(' Customer not found');
      return {
        decision: 'DENIED',
        reason: 'Customer not found in database',
        logs,
        refundAmount: 0
      };
    }
    logs.push(` Found customer: ${customer.name}`);


    logs.push(' Step 2: Checking account status...');
    if (customer.accountStatus !== 'active') {
      logs.push(` Account status is: ${customer.accountStatus}`);
      return {
        decision: 'DENIED',
        reason: 'Account is suspended or inactive',
        logs,
        refundAmount: 0
      };
    }
    logs.push(' Account is active');

   
    logs.push(' Step 3: Checking return window...');
    if (daysSincePurchase > 30) {
      logs.push(` Purchase is ${daysSincePurchase} days old (max 30 days)`);
      return {
        decision: 'DENIED',
        reason: `Outside 30-day return window (${daysSincePurchase} days old)`,
        logs,
        refundAmount: 0
      };
    }
    logs.push(` Purchase is ${daysSincePurchase} days old (within 30 days)`);

    
    logs.push(' Step 4: Checking refund amount...');
    if (amount > 500) {
      logs.push(` Amount requested ($${amount}) exceeds maximum ($500)`);
      return {
        decision: 'DENIED',
        reason: 'Refund amount exceeds maximum of $500',
        logs,
        refundAmount: 0
      };
    }
    logs.push(` Amount ($${amount}) is within limit`);

    logs.push(' Step 5: Calculating refund amount...');
    let refundAmount = amount;
    let deduction = 0;
    if (daysSincePurchase > 15) {
      deduction = amount * 0.5;
      refundAmount = amount - deduction;
      logs.push(`  50% deduction applied (older than 15 days)`);
      logs.push(`   Original: $${amount.toFixed(2)}`);
      logs.push(`   Deduction: $${deduction.toFixed(2)}`);
      logs.push(`   Final Refund: $${refundAmount.toFixed(2)}`);
    } else {
      logs.push(`Full refund: $${refundAmount.toFixed(2)}`);
    }
    logs.push('DECISION: APPROVED');
    return {
      decision: 'APPROVED',
      reason: 'Refund approved after policy validation',
      logs,
      refundAmount,
      deduction
    };
  }
};

module.exports = refundLogic;