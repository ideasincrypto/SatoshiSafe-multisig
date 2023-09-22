import SafeApiKit from "@safe-global/api-kit";
import Safe, { EthersAdapter } from "@safe-global/protocol-kit";
import { ethers } from "ethers";
import { useToast } from "@chakra-ui/react";
import networks from "../components/admin/networks.json";

const useGnosisSafe = () => {
    const toast = useToast();

    const getSafeService = async (network) => {
        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const safeOwner = provider.getSigner(0);
            const ethAdapter = new EthersAdapter({
                ethers,
                signerOrProvider: safeOwner,
            });
            const txServiceUrl = networks[network].safeTransactionService;
            const safeService = new SafeApiKit({
                txServiceUrl,
                ethAdapter,
            });
            return safeService;
        } catch (error) {
            toast({
                description: `Failed to initialize Safe service: ${error.message}`,
                position: "top",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        }
    };

    const getSafesByOwner = async (safeService, ownerAddress) => {
        try {
            const safes = await safeService.getSafesByOwner(ownerAddress);
            return safes;
        } catch (error) {
            toast({
                description: `Failed to get Safes by owner: ${error.message}`,
                position: "top",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        }
    };

    const getSafeInfo = async (safeService, safeAddress) => {
        try {
            const safeInfo = await safeService.getSafeInfo(safeAddress);
            return safeInfo;
        } catch (error) {
            toast({
                description: `Failed to get Safe info: ${error.message}`,
                position: "top",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        }
    };

    const getAllTransactions = async (safeService, safeAddress, allTxsOptions) => {
        try {
            // https://safe-transaction-arbitrum.safe.global/
            // const allTxsOptions = {
            //   executed: bool,
            //   queued: bool,
            //   trusted: bool,
            // }
            const transactions = await safeService.getAllTransactions(safeAddress, allTxsOptions);
            return transactions;
        } catch (error) {
            toast({
                description: `Failed to get all Safe transactions: ${error.message}`,
                position: "top",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        }
    };

    const createAndApproveTransaction = async (safe, safeService, safeAddress, tx, wallet) => {
        try {
            const safeTx = await safe.createTransaction({
                safeTransactionData: tx,
            });
            const txhash = await safe.getTransactionHash(safeTx);
            const signature = await safe.signTransactionHash(txhash);
            safeTx.addSignature(signature);
            await safeService.proposeTransaction({
                safeAddress,
                senderAddress: wallet.address,
                safeTransactionData: safeTx.data,
                safeTxHash: txhash,
                senderSignature: signature.data,
            });
            return true;
        } catch (error) {
            toast({
                description: `Failed to create and approve transaction: ${error.message}`,
                position: "top",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        }
    };

    const confirmTransaction = async (safeService, safeAddress, safeTxHash) => {
        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const safeOwner = provider.getSigner(0);
            const ethAdapter = new EthersAdapter({
                ethers,
                signerOrProvider: safeOwner,
            });
            const safeSdk = await Safe.create({ ethAdapter, safeAddress });
            const signature = await safeSdk.signTransactionHash(safeTxHash);
            await safeService.confirmTransaction(safeTxHash, signature.data);
            return true;
        } catch (error) {
            if (error.message === "SafeProxy contract is not deployed on the current network") {
                return toast({
                    description: "Failed to confirm transaction: wallet and transaction network mismatch.",
                    position: "top",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                });
            }
            toast({
                description: `Failed to confirm transaction: ${error.message}`,
                position: "top",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        }
    };

    const executeTransaction = async (safeService, safeAddress, safeTxHash) => {
        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const safeOwner = provider.getSigner(0);
            const ethAdapter = new EthersAdapter({
                ethers,
                signerOrProvider: safeOwner,
            });
            const safeSdk = await Safe.create({ ethAdapter, safeAddress });
            const safeTransaction = await safeService.getTransaction(safeTxHash);
            const txResponse = await safeSdk.executeTransaction(safeTransaction);
            const resp = await txResponse.transactionResponse?.wait();
            return resp;
        } catch (error) {
            if (error.message === "SafeProxy contract is not deployed on the current network") {
                return toast({
                    description: "Failed to execute transaction: wallet and transaction network mismatch.",
                    position: "top",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                });
            }
            toast({
                description: `Failed to execute transaction: ${error.message}`,
                position: "top",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        }
    };

    return {
        getSafeService,
        getSafesByOwner,
        getSafeInfo,
        getAllTransactions,
        createAndApproveTransaction,
        confirmTransaction,
        executeTransaction,
    };
};

export default useGnosisSafe;
