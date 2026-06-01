/** @param {NS} ns */
export async function main(ns) {
  // Minimum cash reserve so you can still buy servers/programs (Adjust as needed)
  const reserveCash = 5000000000; // $5 billion 

  // Get all stock symbols
  const stockSymbols = ns.stock.getSymbols();

  while (true) {
    let bestSymbol = null;
    let bestForecast = 0.5;
    

    // 1. Evaluate which stock has the best forecast for long-term growth
    for (const sym of stockSymbols) {
      let forecast = ns.stock.getForecast(sym);
      if (forecast > bestForecast) {
        bestForecast = forecast;
        bestSymbol = sym;
      }

      // 2. Sell off any stocks whose forecast has dropped below 0.5
      if (forecast < 0.5) {
        let [shares] = ns.stock.getPosition(sym);
        if (shares > 0) {
          ns.stock.sellStock(sym, shares);
          ns.print(`Sold ${sym} because forecast is ${forecast.toFixed(2)}.`);
        }
      }
    }

    // 3. Buy into the best long-term stock using your available cash
    if (bestSymbol) {
      let [currentShares] = ns.stock.getPosition(bestSymbol);
      let maxShares = ns.stock.getMaxShares(bestSymbol);
      let availableSharesToBuy = maxShares - currentShares;

      if (availableSharesToBuy > 0) {
        let askPrice = ns.stock.getAskPrice(bestSymbol);
        let availableMoney = ns.getPlayer().money - reserveCash;

        // Calculate max affordable shares
        let affordableShares = Math.floor(availableMoney / askPrice);
        let sharesToBuy = Math.min(availableSharesToBuy, affordableShares);

        if (sharesToBuy > 10) { // arbitrary buffer to avoid tiny purchases
          ns.stock.buyStock(bestSymbol, sharesToBuy);
          ns.print(`Bought ${sharesToBuy} of ${bestSymbol} at ${ns.format.number(askPrice, 0.00 )}`);
        }
      }
    }

    // Sleep until the next price tick (around ~6 seconds)
    await ns.stock.nextUpdate();
  }
}
