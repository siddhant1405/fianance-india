export const indicatorMeta = {
  rsi: {
    name: 'RSI',
    category: 'Momentum',
    measures: 'The Relative Strength Index compares recent gains and losses to show how stretched price momentum has become.',
    matters: 'It helps investors spot when a move may be getting crowded or when momentum is cooling after a rally or selloff.',
    interpretation: 'Readings above 70 are often treated as overbought, readings below 30 as oversold, and the middle zone as more neutral.',
    generalInterpretation: [
      'Above 70: Often considered overbought.',
      '30-70: Usually read as neutral.',
      'Below 30: Often considered oversold.',
    ],
    keepInMind: 'RSI can stay elevated or depressed for a long time during strong trends, so it works best with trend and price context.',
  },
  macd: {
    name: 'MACD',
    category: 'Momentum',
    measures: 'MACD compares two moving averages to show changes in trend strength and momentum.',
    matters: 'It can highlight whether buyers or sellers are gaining influence as price trends develop or fade.',
    interpretation: 'A MACD line above its signal line is usually read as improving momentum, while a move below it suggests weakening momentum.',
    generalInterpretation: [
      'MACD above signal line: Momentum is often improving.',
      'MACD below signal line: Momentum is often weakening.',
      'Near zero line: Trend momentum may be mixed or early.',
    ],
    keepInMind: 'MACD is based on moving averages, so it can lag fast price moves and should not be used alone.',
  },
  sma: {
    name: 'SMA',
    category: 'Trend',
    measures: 'A Simple Moving Average shows the average price over a chosen number of periods.',
    matters: 'It smooths noisy price movement and makes the broader trend easier to see.',
    interpretation: 'Price above a key SMA often suggests an upward bias, while price below it can suggest a weaker trend.',
    generalInterpretation: [
      'Price above SMA: Often read as a constructive trend.',
      'Price near SMA: Trend may be consolidating.',
      'Price below SMA: Often read as weaker trend behavior.',
    ],
    keepInMind: 'Because every period is weighted equally, an SMA reacts slowly to sudden market changes.',
  },
  ema: {
    name: 'EMA',
    category: 'Trend',
    measures: 'An Exponential Moving Average tracks average price while giving more weight to recent periods.',
    matters: 'It reacts faster than an SMA, which can help identify newer shifts in trend direction.',
    interpretation: 'Price holding above an EMA can show constructive short-term trend behavior; repeated breaks below it can show pressure.',
    generalInterpretation: [
      'Price above EMA: Short-term trend may be constructive.',
      'Price crossing EMA: Momentum may be shifting.',
      'Price below EMA: Short-term pressure may be present.',
    ],
    keepInMind: 'The faster reaction also means more false signals in choppy markets.',
  },
  bollinger: {
    name: 'Bollinger Bands',
    category: 'Volatility',
    measures: 'Bollinger Bands place upper and lower bands around a moving average based on recent price volatility.',
    matters: 'They show whether price is trading near the high or low end of its recent range.',
    interpretation: 'Touches near the upper band can show extended strength, while touches near the lower band can show extended weakness.',
    generalInterpretation: [
      'Near upper band: Price may be extended on the upside.',
      'Near middle band: Price is near its recent average.',
      'Near lower band: Price may be extended on the downside.',
    ],
    keepInMind: 'A band touch is not automatically a reversal signal; strong trends can keep riding a band.',
  },
  momentum: {
    name: 'Momentum',
    category: 'Momentum',
    measures: 'Momentum compares current price action with earlier price action to show the speed of a move.',
    matters: 'It helps identify whether a trend is accelerating, fading, or moving without much conviction.',
    interpretation: 'Rising momentum supports the current direction, while fading momentum can warn that the move is losing energy.',
    generalInterpretation: [
      'Rising momentum: Current move is gaining strength.',
      'Flat momentum: Price movement may be balanced.',
      'Falling momentum: Current move may be losing strength.',
    ],
    keepInMind: 'Momentum can shift quickly around news, earnings, or broad market moves.',
  },
  volatility: {
    name: 'Volatility',
    category: 'Volatility',
    measures: 'Volatility measures how much price tends to fluctuate over a period.',
    matters: 'It helps investors understand the size of typical moves and the level of uncertainty around an asset.',
    interpretation: 'Higher volatility means wider price swings, while lower volatility means price has been moving in a narrower range.',
    generalInterpretation: [
      'High volatility: Wider price swings are common.',
      'Moderate volatility: Movement is within a typical range.',
      'Low volatility: Price has been moving in a tighter range.',
    ],
    keepInMind: 'Volatility describes movement size, not direction, so high volatility can occur in both rising and falling markets.',
  },
  price: {
    name: 'Price',
    category: 'Price',
    measures: 'Price is the current traded value of an asset in the market.',
    matters: 'It is the base input for returns, chart patterns, and most technical indicators.',
    interpretation: 'Price behavior relative to prior levels, averages, and ranges gives context for trend and sentiment.',
    generalInterpretation: [
      'Rising price: Buyers are currently paying higher levels.',
      'Flat price: Market conviction may be limited.',
      'Falling price: Sellers are currently accepting lower levels.',
    ],
    keepInMind: 'A single price point has limited meaning without volume, history, and broader market context.',
  },
};

export const indicatorAliases = [
  { alias: 'Bollinger Bands', key: 'bollinger' },
  { alias: 'Bollinger', key: 'bollinger' },
  { alias: 'Volatility', key: 'volatility' },
  { alias: 'Momentum', key: 'momentum' },
  { alias: 'MACD', key: 'macd' },
  { alias: 'RSI', key: 'rsi' },
  { alias: 'EMA', key: 'ema' },
  { alias: 'SMA', key: 'sma' },
];

export const getIndicatorKeyByName = (name) => {
  const match = indicatorAliases.find(item => item.alias.toLowerCase() === name.toLowerCase());
  return match?.key || null;
};
