import { Network, Server } from "stellar-sdk"


// Horizon end points for live and test networks. If you run your own node
// then you need to adjust those endpoints accordingly.
export const liveNet = "https://horizon.stellar.org"
export const testNet = "https://horizon-testnet.stellar.org"


// ...
export const server = (horizon) => {
    if (horizon === liveNet) {
        Network.usePublicNetwork()
        return new Server(liveNet)
    }
    Network.useTestNetwork()
    return new Server(testNet)
}
