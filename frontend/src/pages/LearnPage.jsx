import React from 'react';

const marketBasics = [
  {
    title: 'What is a Stock?',
    items: [
      ['What is it?', 'A stock is a small ownership share in a company. When you buy a share, you are buying a claim on a tiny part of that business. The share price moves as investors update their expectations about the company, its industry, and the overall market.'],
      ['How do people make money?', 'Investors can make money in two main ways: capital gains, when the share price rises after purchase, and dividends, when a company distributes part of its profits to shareholders. Neither is guaranteed.'],
      ['Real-world example', 'If someone buys Reliance or TCS shares, they are exposed to that company\'s business performance, management decisions, earnings growth, and investor sentiment. A strong result may support the price, while weak expectations may pressure it.'],
    ],
  },
  {
    title: 'What is a Stock Exchange?',
    items: [
      ['What is it?', 'A stock exchange is an organized marketplace where buyers and sellers trade shares. In India, the two major exchanges are the National Stock Exchange, known as NSE, and the Bombay Stock Exchange, known as BSE. They provide the systems, rules, and transparency needed for orderly trading.'],
      ['Why companies list there', 'Companies list on exchanges to raise money from public investors, create liquidity for existing shareholders, and build credibility. Once listed, their shares can be bought and sold during market hours.'],
      ['Why it matters', 'Exchanges help investors see live prices, trading volumes, and market depth. They also enforce disclosure requirements, which means listed companies must regularly share important financial and business information with the public.'],
    ],
  },
  {
    title: 'Market Index',
    items: [
      ['What is it?', 'A market index is a basket of selected stocks designed to represent a part of the market. Instead of checking hundreds of stocks one by one, investors can look at an index to understand whether the broader market is rising, falling, or moving sideways.'],
      ['Nifty 50 and Sensex', 'The Nifty 50 tracks 50 large companies listed on the NSE. The Sensex tracks 30 large companies listed on the BSE. Both are widely used as benchmarks for Indian equities.'],
      ['Why indexes exist', 'Indexes make market performance easier to measure. Fund managers compare their returns with indexes, news channels use them to describe market direction, and investors use them to understand overall sentiment.'],
    ],
  },
  {
    title: 'Forex',
    items: [
      ['What is it?', 'Forex is the market for currencies. Currencies trade in pairs, such as USD/INR or EUR/INR, because one currency is always priced relative to another. If USD/INR rises, it means one US dollar buys more rupees than before.'],
      ['Why exchange rates change', 'Exchange rates move because of interest rates, inflation, trade flows, central bank policy, global risk appetite, and demand for each currency. News about the US economy, oil prices, or Indian growth can all affect INR pairs.'],
      ['Why INR pairs matter', 'INR pairs matter for importers, exporters, travelers, companies with foreign debt, and investors. A weaker rupee can make imports costlier, while a stronger rupee can affect export competitiveness.'],
    ],
  },
  {
    title: 'Commodities',
    items: [
      ['What are they?', 'Commodities are physical goods or raw materials that are traded in markets. Common examples include gold, silver, crude oil, natural gas, and agricultural products. Their prices are often influenced by global supply and demand rather than one company\'s performance.'],
      ['Gold, silver, and oil', 'Gold is often tracked as a store of value and a hedge during uncertainty. Silver has both investment and industrial demand. Oil matters because it affects fuel prices, inflation, trade balances, and company costs.'],
      ['Why investors track them', 'Commodities can reveal important signals about inflation, growth, currency pressure, and risk sentiment. Indian investors especially watch gold and oil because both can influence household savings, imports, and the rupee.'],
    ],
  },
  {
    title: 'Technical Analysis vs Fundamental Analysis',
    items: [
      ['Technical analysis', 'Technical analysis studies price behavior. It uses charts, trends, support and resistance levels, volume, and indicators such as RSI, MACD, and moving averages. The goal is to understand market behavior and timing, not the intrinsic value of a business.'],
      ['Fundamental analysis', 'Fundamental analysis studies the underlying quality and value of an asset. For stocks, it looks at company financials, revenue growth, profits, debt, cash flow, management, industry position, and valuation. Valuation means judging whether the price looks reasonable compared with business performance.'],
      ['How they work together', 'The two approaches can complement each other. A long-term investor may use fundamentals to choose a strong company, then use technical analysis to understand entry points, trend strength, or short-term risk.'],
    ],
  },
];

const indicators = [
  {
    title: 'RSI',
    measures: 'RSI measures the speed and magnitude of recent price changes to estimate buying or selling momentum. It converts recent gains and losses into a value between 0 and 100, which makes it easier to compare momentum across assets and timeframes.',
    typical: [
      ['Above 70', 'Often considered overbought, meaning price may have risen quickly and could be stretched.'],
      ['30-70', 'Generally neutral, where momentum is not clearly extreme in either direction.'],
      ['Below 30', 'Often considered oversold, meaning price may have fallen quickly and could be stretched.'],
    ],
    limitations: 'RSI can remain overbought or oversold for extended periods during strong market trends. A high RSI does not automatically mean price will fall, and a low RSI does not automatically mean price will rise. It is best used with trend, volume, and price structure.',
  },
  {
    title: 'MACD',
    measures: 'MACD measures changes in trend momentum by comparing two exponential moving averages. It usually includes a MACD line, a signal line, and sometimes a histogram that shows the gap between them. It helps investors see whether momentum is strengthening or weakening.',
    typical: [
      ['MACD above signal line', 'Often read as improving upward momentum.'],
      ['MACD below signal line', 'Often read as weakening momentum or rising downside pressure.'],
      ['Near zero line', 'Momentum may be mixed, early, or lacking direction.'],
    ],
    limitations: 'MACD is built from moving averages, so it can lag fast price moves. It may also create false signals in sideways markets where price keeps crossing back and forth. Investors usually combine it with trend direction, support and resistance, and broader market context.',
  },
  {
    title: 'SMA',
    measures: 'SMA, or Simple Moving Average, measures the average closing price over a selected period. A 50-day SMA adds the last 50 closing prices and divides by 50. It smooths daily noise so the broader direction becomes easier to see.',
    typical: [
      ['Price above SMA', 'Often suggests the asset is trading with a constructive trend bias.'],
      ['Price near SMA', 'Can suggest consolidation or a decision area.'],
      ['Price below SMA', 'Often suggests weaker trend behavior.'],
    ],
    limitations: 'SMA reacts slowly because every price in the period receives equal weight. That makes it useful for smoothing, but less responsive to sudden changes. In choppy markets, price may cross the SMA many times without producing a useful signal.',
  },
  {
    title: 'EMA',
    measures: 'EMA, or Exponential Moving Average, measures average price while giving more weight to recent data. Because it reacts faster than an SMA, many traders use it to follow shorter-term trend changes or to compare fast and slow averages.',
    typical: [
      ['Price above EMA', 'Often suggests recent price action is constructive.'],
      ['Price crossing EMA', 'Can suggest a possible change in short-term momentum.'],
      ['Price below EMA', 'Often suggests recent pressure or weakness.'],
    ],
    limitations: 'EMA responds faster, but that also means it can react to temporary noise. A quick move above or below an EMA may not become a real trend. It works better when used with price structure, volume, and a suitable timeframe.',
  },
  {
    title: 'Bollinger Bands',
    measures: 'Bollinger Bands measure how far price is moving from a moving average based on recent volatility. The middle line is usually a moving average, while the upper and lower bands expand or contract as price swings become larger or smaller.',
    typical: [
      ['Near upper band', 'Price may be strong or stretched on the upside.'],
      ['Near middle band', 'Price is close to its recent average.'],
      ['Near lower band', 'Price may be weak or stretched on the downside.'],
    ],
    limitations: 'Touching a band is not automatically a buy or sell signal. Strong trends can keep moving along the upper or lower band for a long time. Bands are most useful when combined with trend, momentum, and market conditions.',
  },
  {
    title: 'Momentum',
    measures: 'Momentum measures the rate of price change over a chosen period. It tries to answer a simple question: is the current move gaining strength, losing strength, or moving without much force? Rising momentum often confirms the current direction.',
    typical: [
      ['Rising momentum', 'The current price move may be gaining strength.'],
      ['Flat momentum', 'The asset may be moving without clear conviction.'],
      ['Falling momentum', 'The current move may be losing energy.'],
    ],
    limitations: 'Momentum can change quickly, especially around earnings, policy decisions, or global news. It can also look strong near the end of a move. Investors should avoid treating momentum as a prediction and should compare it with price levels and risk.',
  },
  {
    title: 'Volatility',
    measures: 'Volatility measures how much an asset price moves over time. Higher volatility means wider price swings, while lower volatility means tighter movement. It does not show direction; it only describes the size and frequency of price changes.',
    typical: [
      ['High volatility', 'Wider price swings are common and risk may be higher.'],
      ['Moderate volatility', 'Price movement is closer to its normal range.'],
      ['Low volatility', 'Price has been moving in a tighter range.'],
    ],
    limitations: 'Volatility does not say whether price will rise or fall. A highly volatile asset can move sharply in either direction. Low volatility can also change suddenly after news. It is useful for risk awareness, not for predicting direction by itself.',
  },
  {
    title: 'Volume',
    measures: 'Volume measures how many shares, contracts, or units are traded during a period. It shows participation behind a price move. A price rise with high volume usually has more market participation than a similar rise on very low volume.',
    typical: [
      ['Rising price with high volume', 'Often suggests stronger buyer participation.'],
      ['Falling price with high volume', 'Often suggests stronger selling pressure.'],
      ['Low volume', 'Moves may be less reliable or easier to reverse.'],
    ],
    limitations: 'Volume needs context. Some stocks naturally trade more than others, and volume can spike for temporary reasons such as news, index changes, or block deals. It should be compared with the asset\'s own normal volume, not just viewed in isolation.',
  },
];

const concepts = [
  {
    title: 'Support & Resistance',
    definition: 'Support is a price area where buying has appeared before, slowing or stopping a fall. Resistance is a price area where selling has appeared before, slowing or stopping a rise.',
    matters: 'These levels help investors understand where the market has previously changed behavior. They are not fixed walls, but zones where attention often increases.',
    example: 'If a stock has bounced several times near Rs. 1,000, traders may watch that area as support. If it repeatedly fails near Rs. 1,200, that area may act as resistance.',
  },
  {
    title: 'Trend',
    definition: 'A trend is the general direction of price over time. An uptrend has a pattern of higher prices, a downtrend has lower prices, and a sideways trend moves within a range.',
    matters: 'Knowing the trend helps investors avoid reading every small move as important. It also gives context to indicators; the same RSI value can mean different things in a strong trend versus a sideways market.',
    example: 'A stock making higher highs and higher lows over several weeks is usually considered to be in an uptrend.',
  },
  {
    title: 'Bull Market',
    definition: 'A bull market is a period when prices are generally rising and investor confidence is strong. It can apply to the entire market, a sector, or a single asset.',
    matters: 'Bull markets often make risk-taking feel easier, but they can also encourage overconfidence. Valuations may rise quickly when investors expect strong future growth.',
    example: 'If the Nifty 50 rises steadily for months with broad participation from banks, IT, auto, and consumer stocks, investors may describe the environment as bullish.',
  },
  {
    title: 'Bear Market',
    definition: 'A bear market is a period when prices are generally falling and investor confidence is weak. It is often associated with slower growth, earnings pressure, high interest rates, or global uncertainty.',
    matters: 'Bear markets can create stress, but they also teach the importance of risk management, diversification, and avoiding excessive leverage. Strong companies can also fall during broad market weakness.',
    example: 'If major indexes decline sharply and most sectors participate in the fall, investors may describe the market environment as bearish.',
  },
  {
    title: 'Market Capitalization',
    definition: 'Market capitalization, or market cap, is the total market value of a company. It is calculated by multiplying the share price by the number of shares outstanding.',
    matters: 'Market cap helps investors compare company size. Large-cap companies are often more established, while mid-cap and small-cap companies may offer faster growth but can carry higher risk.',
    example: 'If a company has 100 crore shares and each share trades at Rs. 500, its market capitalization is Rs. 50,000 crore.',
  },
  {
    title: 'Liquidity',
    definition: 'Liquidity describes how easily an asset can be bought or sold without causing a large price change. Highly liquid stocks usually have many buyers and sellers throughout the day.',
    matters: 'Liquidity affects execution. In liquid assets, investors can usually enter or exit positions closer to the displayed price. In illiquid assets, the gap between buying and selling prices can be wider.',
    example: 'Large stocks like Reliance or HDFC Bank usually trade with high liquidity, while a small company with low trading volume may be harder to sell quickly.',
  },
  {
    title: 'Diversification',
    definition: 'Diversification means spreading investments across different assets, sectors, or themes instead of relying on one position. The goal is to reduce the impact of one bad outcome.',
    matters: 'Even good investments can go through weak periods. Diversification helps balance company-specific, sector-specific, and market-wide risks. It does not eliminate risk, but it can make a portfolio less dependent on one idea.',
    example: 'An investor may hold banks, IT stocks, consumer companies, gold, and mutual funds instead of putting all savings into one stock.',
  },
];

const resources = [
  {
    title: 'Zerodha Varsity',
    description: 'One of the best free resources for learning the Indian stock market, technical analysis, derivatives, mutual funds, and investing from scratch.',
    link: 'https://zerodha.com/varsity/',
  },
  {
    title: 'Khan Academy - Finance & Capital Markets',
    description: 'Excellent beginner-friendly course covering stocks, bonds, interest rates, financial statements, investing, and economics.',
    link: 'https://www.khanacademy.org/economics-finance-domain/core-finance',
  },
  {
    title: 'Investopedia',
    description: 'A comprehensive financial dictionary and reference for investment terms, indicators, and market concepts.',
    link: 'https://www.investopedia.com/',
  },
];

const SectionHeader = ({ title }) => (
  <div>
    <h2 className="text-2xl font-bold text-txt-primary">{title}</h2>
  </div>
);

const LearnPage = () => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12 space-y-10">
      <div>
        <h1 className="text-3xl font-bold text-txt-primary mb-3">Learn</h1>
        <p className="text-txt-secondary text-lg">
          Clear market basics for investors who know the idea of investing, but are new to financial markets.
        </p>
      </div>

      <section className="space-y-4">
        <SectionHeader title="Market Basics" />
        {marketBasics.map(topic => (
          <article key={topic.title} className="bg-surface-1 border border-line rounded-2xl p-6">
            <h3 className="text-xl font-bold text-txt-primary mb-4">{topic.title}</h3>
            <div className="space-y-3 text-sm text-txt-secondary leading-relaxed">
              {topic.items.map(([label, text]) => (
                <p key={label}>
                  <span className="font-semibold text-txt-primary">{label}:</span> {text}
                </p>
              ))}
            </div>
          </article>
        ))}
      </section>

      <section className="space-y-4">
        <SectionHeader title="Technical Indicators" />
        {indicators.map(indicator => (
          <article key={indicator.title} className="bg-surface-1 border border-line rounded-2xl p-6">
            <h3 className="text-xl font-bold text-txt-primary mb-4">{indicator.title}</h3>
            <div className="space-y-4 text-sm text-txt-secondary leading-relaxed">
              <div>
                <h4 className="font-semibold text-txt-primary mb-1">What it measures</h4>
                <p>{indicator.measures}</p>
              </div>
              <div>
                <h4 className="font-semibold text-txt-primary mb-1">Typical interpretation</h4>
                <div className="space-y-1">
                  {indicator.typical.map(([label, text]) => (
                    <p key={label}>
                      <span className="font-semibold text-txt-primary">{label}:</span> {text}
                    </p>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-txt-primary mb-1">Limitations</h4>
                <p>{indicator.limitations}</p>
              </div>
            </div>
          </article>
        ))}
      </section>

      <section className="space-y-4">
        <SectionHeader title="Important Concepts" />
        {concepts.map(concept => (
          <article key={concept.title} className="bg-surface-1 border border-line rounded-2xl p-6">
            <h3 className="text-xl font-bold text-txt-primary mb-4">{concept.title}</h3>
            <div className="space-y-3 text-sm text-txt-secondary leading-relaxed">
              <p><span className="font-semibold text-txt-primary">Definition:</span> {concept.definition}</p>
              <p><span className="font-semibold text-txt-primary">Why it matters:</span> {concept.matters}</p>
              <p><span className="font-semibold text-txt-primary">Short practical example:</span> {concept.example}</p>
            </div>
          </article>
        ))}
      </section>

      <section className="bg-surface-1 border border-line rounded-2xl p-6">
        <h2 className="text-xl font-bold text-txt-primary mb-3">Technical indicators are tools - not predictions.</h2>
        <p className="text-sm text-txt-secondary leading-relaxed">
          No single indicator can consistently predict future prices. Most investors use multiple indicators together, along with news, company fundamentals, and broader market conditions before making decisions.
        </p>
      </section>

      <section className="space-y-4">
        <SectionHeader title="Further Learning" />
        {resources.map(resource => (
          <a
            key={resource.title}
            href={resource.link}
            target="_blank"
            rel="noreferrer"
            className="block bg-surface-1 border border-line rounded-2xl p-6 hover:border-line-hover transition-colors"
          >
            <h3 className="text-xl font-bold text-txt-primary mb-2">{resource.title}</h3>
            <p className="text-sm text-txt-secondary leading-relaxed">{resource.description}</p>
          </a>
        ))}
      </section>
    </div>
  );
};

export default LearnPage;
