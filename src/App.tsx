import {
  useClaimedNFTSupply,
  useContractMetadata,
  useNFTDrop,
  useUnclaimedNFTSupply,
  useAddress,
  useMetamask,
  useNetworkMismatch,
  useNetwork,
  ChainId
} from "@thirdweb-dev/react";
import { useState } from "react";

const contractAddress = "0xfFeDd0B673bf91060Dcc073fE93068903aeA0366";

function App() {
  const [claiming, setClaiming] = useState(false);
  const address = useAddress();
  const connectMetamask = useMetamask();
  const contract = useNFTDrop(contractAddress);
  const isWrongNetwork = useNetworkMismatch();
  const [, swithNetwork] = useNetwork();
  const { data: contractMetadata } = useContractMetadata(contractAddress);
  const { data: claimedNFTSupply } = useClaimedNFTSupply(contract);
  const { data: unclaimedNFTSupply } = useUnclaimedNFTSupply(contract);

  const mint = async () => {
    //  checking if the user has connected
    if (!address) {
      connectMetamask();
      return;
    }

    //  check if the user is on the right network
    if (isWrongNetwork) {
      swithNetwork && swithNetwork(ChainId.Mumbai);
      return;
    }

    setClaiming(true);

    try {
      await contract?.claim(2);
      alert("minted successfully");
      setClaiming(false);
    } catch (error) {
      alert("error");
      setClaiming(false);
    }
  };

  if (!contract || !contractMetadata) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        loading...
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-6xl flex-col p-6 md:p-12">
      <main className="grid gap-6 rounded-md bg-black/20 p-6 md:grid-cols-2 md:p-12">
        <div className="flex flex-col items-center justify-center space-y-6">
          <h1 className="text-2xl font-bold text-secondary">
            {contractMetadata?.name}
          </h1>
          <p className="text-center leading-relaxed">
            {contractMetadata?.description}
          </p>
        </div>

        <div className="flex flex-col items-center">
          <div className="flex w-full max-w-sm flex-col space-y-4">
            <div className="aspect-square w-full overflow-hidden rounded-md">
              <img
                className="aspect-square object-cover"
                src={contractMetadata?.image}
                alt="CryptoDix"
              />
            </div>

            <div className="flex max-w-sm justify-between">
              <p>MAX BIDDING</p>
              <p>
                {claimedNFTSupply?.toNumber() || 0} /{" "}
                {(claimedNFTSupply?.toNumber() || 0) +
                  (unclaimedNFTSupply?.toNumber() || 0)}
              </p>
            </div>

            <div className="flex justify-center">
              {address && (
                <button
                  className="rounded-full bg-primary px-6 py-2 text-white hover:bg-opacity-75"
                  onClick={mint}
                  disabled={claiming}
                >
                  {claiming ? "Claimig..." : "Mint Now"}
                </button>
              )}
              {!address && (
                <button
                  className="rounded-full bg-primary px-6 py-2 text-white hover:bg-opacity-75"
                  onClick={connectMetamask}
                >
                  Connect Wallet
                </button>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
