import {useEffect} from 'react'

export default function RubicWidget(props) {
    useEffect(() => {
    // TODO: Change configuration to proper one
    const configuration = {
        from: 'MATIC',
        to: '0x1FA2F83BA2DF61c3d370071d61B17Be01e224f3a',
        fromChain: 'POLYGON',
        toChain: 'POLYGON',
        amount: 1,
        iframe: 'vertical',
        theme: 'dark',
        background: '#28372e',
        injectTokens: {
            eth: ['0xd123575d94a7ad9bff3ad037ae9d4d52f41a7518'],
            bsc: ['0x8aed24bf6e0247be51c57d68ad32a176bf86f4d9'],
            hny: ['0x1FA2F83BA2DF61c3d370071d61B17Be01e224f3a']
        },
        slippagePercent: {
            instantTrades: 2,
            crossChain: 5
        },
        fee: 0.075,
        feeTarget: '0x34c8aC12DCf5b0e4ED2deEA7AD9504b3bCdF5e8F',
        promoCode: 'mHm7RwUw'
    }
        // create widget
        window?.rubicWidget.init(configuration);
    })
    return <div id="rubic-widget-root" />
}