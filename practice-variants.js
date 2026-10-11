/* Original calculation exercises. Deterministic IDs and bounded parameters.
   Changing an existing exercise requires a version bump or a new family ID. */
(function(root){
'use strict';
const money=n=>'$'+n.toFixed(2);
const number=n=>Number(n.toFixed(2)).toString();
const pct=n=>number(n)+'%';
const families=[];
function family(id,topic,label,alignment,make){families.push({id,topic,label,alignment,make});}
// Values are deliberately hypothetical, not current rates, tax rules or product terms.
family('tradeoff','micro','Production trade-offs','Economics 1: Scarcity and Allocation',i=>{
 const tables=10+i,perTable=2+i%8,chairs=tables*perTable;
 return {params:{tables,chairs},value:perTable,format:n=>number(n)+' chairs',stem:`A workshop can produce either ${tables} tables or ${chairs} chairs with the same resources. Assuming a constant trade-off, how many chairs are given up to produce one table?`,explanation:`Divide the chairs by the tables: ${chairs} ÷ ${tables} = ${perTable} chairs per table. Opportunity cost measures the alternative production forgone.`};
});
family('forgone-pay','micro','Forgone earnings','Economics 2: Decision-Making',i=>{
 const hours=2+i%5,wage=12+i,value=hours*wage;
 return {params:{hours,wage},value,stem:`A student chooses a free workshop lasting ${hours} hours instead of an available job paying ${money(wage)} per hour. If that job is the next-best alternative and there are no other costs, what are the forgone earnings?`,explanation:`The earnings forgone are ${hours} × ${money(wage)} = ${money(value)}. A free workshop still has an opportunity cost because the same time could have been spent earning income.`};
});
family('real-gdp','macro','Real GDP','Economics 11: Gross Domestic Product',i=>{
 const real=200+i*10,deflator=105+(i%8)*5,nominal=real*deflator/100;
 return {params:{nominal,deflator},value:real,format:n=>number(n)+' billion dollars',stem:`An economy has nominal GDP of ${number(nominal)} billion dollars and a GDP price index of ${deflator} (base year = 100). What is real GDP in base-year dollars?`,explanation:`Adjust nominal GDP for the price level: ${number(nominal)} ÷ (${deflator} ÷ 100) = ${real} billion base-year dollars. This removes the price-level difference from the nominal figure.`};
});
family('inflation','macro','Price-index inflation','Economics 15: Inflation',i=>{
 const before=100+i*5,rate=1+i%8,after=before*(100+rate)/100;
 return {params:{before,after},value:rate,format:pct,stem:`A price index rises from ${number(before)} to ${number(after)} in one year. What is the percentage increase in the price level? Round to two decimal places if needed.`,explanation:`Use the starting index as the denominator: (${number(after)} − ${before}) ÷ ${before} × 100 = ${rate}%. The difference in index points alone is not the percentage change.`};
});
family('euros-to-dollars','trade','Currency Conversion to Dollars','Economics 9: International Trade',i=>{
 const euros=20+i*5,centsPerEuro=105+i%16*5,value=euros*centsPerEuro/100;
 return {params:{euros,centsPerEuro},value,stem:`A product costs €${euros}. At a hypothetical exchange rate of ${money(centsPerEuro/100)} per euro, what is its dollar price? Ignore fees.`,explanation:`Multiply the euro amount by dollars per euro: ${euros} × ${money(centsPerEuro/100)} = ${money(value)}. The euro units cancel, leaving dollars.`};
});
family('dollars-to-euros','trade','Currency Conversion to Euros','Economics 9: International Trade',i=>{
 const euros=30+i*5,centsPerEuro=110+i%9*10,dollars=euros*centsPerEuro/100;
 return {params:{dollars,centsPerEuro},value:euros,format:n=>'€'+n.toFixed(2),stem:`You exchange ${money(dollars)} at a hypothetical rate of ${money(centsPerEuro/100)} per euro. With no fees, how many euros do you receive?`,explanation:`Divide dollars by dollars per euro: ${money(dollars)} ÷ ${money(centsPerEuro/100)} per euro = €${euros.toFixed(2)}. Multiplying would use the conversion in the wrong direction.`};
});
family('exchange-change','trade','Exchange-Rate Price Changes','Economics 9: International Trade',i=>{
 const euros=40+i*5,before=120+i%5*5,after=before-10,value=euros*(before-after)/100;
 return {params:{euros,before,after},value,stem:`A product stays priced at €${euros} while the dollar price of one euro falls from ${money(before/100)} to ${money(after/100)}. Ignoring fees, by how many dollars does the product's dollar price fall?`,explanation:`The dollar cost falls by €${euros} × (${money(before/100)} − ${money(after/100)}) per euro = ${money(value)}. This is the reduction in cost, not the new total price.`};
});
family('gross-pay','income','Gross pay','Personal finance: Earning Income',i=>{
 const hours=10+i%20,wage=12+i,value=hours*wage;
 return {params:{hours,wage},value,stem:`A worker earns ${money(wage)} per hour for ${hours} hours, all paid at that rate. What is gross pay before deductions?`,explanation:`Gross pay equals hours multiplied by the hourly wage: ${hours} × ${money(wage)} = ${money(value)}. Deductions would affect net pay, not this gross amount.`};
});
family('net-pay','income','Net pay','Personal finance: Earning Income',i=>{
 const gross=400+i*20,tax=40+i*2,benefits=15+i,value=gross-tax-benefits;
 return {params:{gross,tax,benefits},value,stem:`A pay statement shows ${money(gross)} gross pay, ${money(tax)} withheld for taxes, and ${money(benefits)} deducted for benefits. There are no other deductions. What is net pay?`,explanation:`Subtract both stated deductions from gross pay: ${money(gross)} − ${money(tax)} − ${money(benefits)} = ${money(value)}. The stated withholding is an assumption, not a tax-rate rule.`};
});
family('budget','spending','Budget remainder','Personal finance: Spending',i=>{
 const income=800+i*25,spending=500+i*10,saving=100+i*5,value=income-spending-saving;
 return {params:{income,spending,saving},value,stem:`A monthly plan has ${money(income)} take-home income, ${money(spending)} in spending, and ${money(saving)} allocated to savings. How much income remains unallocated?`,explanation:`Subtract both spending and the savings allocation: ${money(income)} − ${money(spending)} − ${money(saving)} = ${money(value)}. Money already set aside for saving is not unallocated income.`};
});
family('unit-price','spending','Unit prices','Personal finance: Spending',i=>{
 const count=3+i%6,unitCents=75+i*10,total=count*unitCents/100;
 return {params:{count,total},value:unitCents/100,stem:`A pack of ${count} identical notebooks costs ${money(total)} before tax. What is the price per notebook before tax?`,explanation:`Divide the total pack price by the number of notebooks: ${money(total)} ÷ ${count} = ${money(unitCents/100)} per notebook. Unit prices help compare different package sizes.`};
});
family('discount','spending','Discounted prices','Personal finance: Spending',i=>{
 const price=40+i*5,discount=10+i%7*5,value=price*(100-discount)/100;
 return {params:{price,discount},value,stem:`An item originally costs ${money(price)} and is discounted by ${discount}%. What is the sale price before tax?`,explanation:`The buyer pays ${100-discount}% of the original price: ${money(price)} × ${(100-discount)/100} = ${money(value)}. The question asks for the sale price, not the amount saved.`};
});
family('simple-saving','saving','Simple interest','Personal finance: Saving',i=>{
 const principal=200+i*50,rate=2+i%7,years=1+i%4,value=principal*rate*years/100;
 return {params:{principal,rate,years},value,stem:`A hypothetical deposit of ${money(principal)} earns ${rate}% simple interest per year for ${years} years. Interest does not compound. With no transactions or fees, how much interest is earned in total?`,explanation:`Simple interest is principal × annual rate × years: ${money(principal)} × ${rate/100} × ${years} = ${money(value)}. This is interest only; the principal is not part of the interest earned.`};
});
family('compound-saving','saving','Annual compounding','Personal finance: Saving',i=>{
 const principal=200+i*100,rate=2+i%7,years=2,value=principal*(1+rate/100)**years;
 return {params:{principal,rate,years},value,stem:`A hypothetical account starts with ${money(principal)} and earns ${rate}% interest compounded annually for two years. With no fees or transactions, what is its final balance? Round to the nearest cent.`,explanation:`After the first year, interest becomes part of the balance. The final amount is ${money(principal)} × ${(1+rate/100).toFixed(2)} × ${(1+rate/100).toFixed(2)} = ${money(value)}. Compounding earns interest on earlier interest.`};
});
family('saving-goal','saving','Monthly savings goals','Personal finance: Saving',i=>{
 const saved=100+i*10,months=3+i%10,monthly=25+i*5,goal=saved+months*monthly;
 return {params:{saved,months,goal},value:monthly,stem:`You already have ${money(saved)} toward a ${money(goal)} goal. Assuming no interest or withdrawals, how much must you save each month for ${months} months to reach it?`,explanation:`Subtract existing savings, then divide by the remaining months: (${money(goal)} − ${money(saved)}) ÷ ${months} = ${money(monthly)} per month. Existing savings need not be saved a second time.`};
});
family('borrowing-cost','credit','Total borrowing cost','Personal finance: Managing Credit',i=>{
 const principal=500+i*50,payments=10,payment=principal/10+5+i,value=payments*payment-principal;
 return {params:{principal,payments,payment},value,stem:`A loan provides ${money(principal)} today and requires ${payments} payments of ${money(payment)}. There are no other fees or payments. What is the total borrowing cost above the principal?`,explanation:`Total repayments are ${payments} × ${money(payment)} = ${money(payments*payment)}. Subtract the ${money(principal)} borrowed to obtain ${money(value)} in borrowing cost. Principal repayment is not itself a borrowing charge.`};
});
family('compare-loans','credit','Comparing repayment totals','Personal finance: Managing Credit',i=>{
 const principal=500+i*20,payments=12,a=50+i*2,b=a+3+i%8,value=(b-a)*payments;
 return {params:{principal,payments,a,b},value,stem:`Two loans each provide ${money(principal)} today. Loan A requires ${payments} payments of ${money(a)}; loan B requires ${payments} payments of ${money(b)}. Neither has other fees. How much lower is A's total borrowing cost?`,explanation:`Both loans provide the same principal, so compare repayment totals: ${payments} × (${money(b)} − ${money(a)}) = ${money(value)}. This compares total cost, not an annual percentage rate.`};
});
family('simple-loan','credit','Simple loan interest','Personal finance: Managing Credit',i=>{
 const principal=500+i*100,rate=4+i%9,months=3+i%10,value=principal*rate*months/1200;
 return {params:{principal,rate,months},value,stem:`A hypothetical loan charges ${rate}% annual simple interest on an unchanged ${money(principal)} principal for ${months} months. No payments or fees occur during that period. How much interest accrues? Round to the nearest cent.`,explanation:`Convert months to years: interest = ${money(principal)} × ${rate/100} × (${months} ÷ 12) = ${money(value)}, rounded to cents. This stated simple-interest model does not describe an amortizing loan.`};
});
family('total-return','investing','Total investment return','Personal finance: Investing',i=>{
 const initial=500+i*100,income=initial/100,rate=3+i%12,final=initial+initial*rate/100-income;
 return {params:{initial,income,final},value:rate,format:pct,stem:`An investment bought for ${money(initial)} ends the year worth ${money(final)} and pays ${money(income)} in cash income. Ignoring taxes and fees, what is the one-year total return as a percentage of the initial investment?`,explanation:`Include both the price change and cash income: (${money(final)} − ${money(initial)} + ${money(income)}) ÷ ${money(initial)} × 100 = ${rate}%. Cash income is part of total return even when not reinvested.`};
});
family('investment-gain','investing','Investment dollar gains','Personal finance: Investing',i=>{
 const shares=5+i,paid=20+i%10,sold=paid+4+i%7,dividend=1+i%3,value=shares*(sold-paid+dividend);
 return {params:{shares,paid,sold,dividend},value,stem:`You buy ${shares} shares at ${money(paid)} each, receive ${money(dividend)} per share in cash dividends, and sell every share at ${money(sold)}. Ignoring taxes and fees, what is your total dollar gain?`,explanation:`Gain per share is sale price minus purchase price plus the dividend: ${money(sold)} − ${money(paid)} + ${money(dividend)} = ${money(sold-paid+dividend)}. Multiply by ${shares} shares to obtain ${money(value)}.`};
});
family('portfolio-share','investing','Portfolio proportions','Personal finance: Investing',i=>{
 const total=1000+i*100,share=10+i%8*10,holding=total*share/100;
 return {params:{total,holding},value:share,format:pct,stem:`A portfolio has a total value of ${money(total)}, including ${money(holding)} in one holding. What percentage of the portfolio is in that holding?`,explanation:`Divide the holding by the total portfolio: ${money(holding)} ÷ ${money(total)} × 100 = ${share}%. This measures the allocation only; it does not tell you whether that allocation is suitable for an investor.`};
});
family('deductible','risk','Insurance deductibles','Personal finance: Managing Risk',i=>{
 const loss=200+i*50,deductible=300+i%4*50,value=Math.max(0,loss-deductible);
 return {params:{loss,deductible},value,stem:`A hypothetical policy covers a ${money(loss)} loss only after you pay a ${money(deductible)} deductible. None of that deductible has been met. With no other cost sharing or limits, how much does the insurer pay?`,explanation:`The insurer pays only the loss above the deductible: max(0, ${money(loss)} − ${money(deductible)}) = ${money(value)}. If the loss does not exceed the deductible, the insurer pays nothing.`};
});
family('coverage-limit','risk','Insurance payout limits','Personal finance: Managing Risk',i=>{
 const loss=500+i*75,limit=1000+i%5*100,value=Math.min(loss,limit);
 return {params:{loss,limit},value,stem:`A hypothetical policy has no deductible or other cost sharing and pays for a covered loss up to a ${money(limit)} payout limit per incident. For a single covered loss of ${money(loss)}, how much does the insurer pay?`,explanation:`The insurer pays the smaller of the covered loss and the payout limit: min(${money(loss)}, ${money(limit)}) = ${money(value)}. Any amount beyond the stated limit remains unpaid by this policy.`};
});
family('annual-premium','risk','Annual insurance premiums','Personal finance: Managing Risk',i=>{
 const monthly=25+i*5,value=monthly*12;
 return {params:{monthly},value,stem:`An insurance policy charges ${money(monthly)} each month for a full year, with no other premium fees or discounts. How much is paid in premiums over those 12 months?`,explanation:`Annual premiums equal the monthly premium multiplied by 12: ${money(monthly)} × 12 = ${money(value)}. Premiums pay for coverage; they are distinct from a deductible or a claim payout.`};
});
const questions=families.flatMap((f,fi)=>Array.from({length:40},(_,i)=>{
 const item=f.make(i),format=item.format||money;
 const value=Math.round((item.value+Number.EPSILON)*100)/100;
 // Construct distinct, nonnegative choices after display rounding.
 const step=Math.max(1,Math.round(value*.15)),wrong=[value+step,value+2*step,value>=step?value-step:value+3*step];
 const answer=(i+fi)%4,choices=wrong.map(format);choices.splice(answer,0,format(value));
 const economics=['micro','macro','trade'].includes(f.topic);
 return {id:`calc-${f.id}-${String(i+1).padStart(2,'0')}`,version:1,topic:f.topic,family:f.id,skill:f.label,kind:'numerical-variant',params:item.params,stem:item.stem,choices,answer,explanation:item.explanation,alignment:f.alignment,source:economics?'https://www.councilforeconed.org/policy-advocacy/k-12-standards/':'https://www.councilforeconed.org/wp-content/uploads/2021/10/2021-National-Standards-for-Personal-Financial-Education.pdf',sourceLabel:economics?'CEE economics standards (2025)':'CEE/Jump$tart personal finance standards (2021)',difficulty:'Foundation',authorship:'Original numerical variant',reviewStatus:'Automated arithmetic checks; not independently NCCEE-reviewed'};
}));
const api={questions,families:families.map(({id,topic,label,alignment})=>({id,topic,label,alignment}))};
if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.PracticeVariants=api;
})(typeof window!=='undefined'?window:globalThis);
