interface WalletProps {
    id: number
    name: string
    type: 'publisher' | 'advertiser'
    address: string
    token: string
}