/* eslint-disable */
// @ts-nocheck
import {
  QUILLTOKEN_ADDRESS,
  SERVICE_MANAGER_CONTRACT_ADDRESS,
} from "@/lib/constants"
import {
  useAccount,
  useBalance,
  useReadContract,
  useWriteContract,
} from "wagmi"
import { formatEther, parseAbi, parseEther } from "viem"

const { data: hash, writeContract, isPending } = useWriteContract()
const { address } = useAccount()
async function submit() {
  if (!address) return

  writeContract({
    address: QUILLTOKEN_ADDRESS,
    abi: parseAbi(["function mint(address account, uint256 amount)"]),
    functionName: "mint",
    args: [address, parseEther("10")],
  })
}

/**
 * @notice Submits a new audit task by approving the insurance contract and then creating the task.
 * @param {string} contractAddress - The address of the contract to be audited.
 */
async function submitContract(contractAddress) {
  // Approve the SERVICE_MANAGER_CONTRACT_ADDRESS to spend a large amount of QUILL tokens on behalf of the user
  writeContract({
    address: QUILLTOKEN_ADDRESS, // Address of the QUILLTOKEN contract
    abi: parseAbi(["function approve(address spender, uint256 amount)"]), // ABI for the approve function
    functionName: "approve", // Function to call
    args: [SERVICE_MANAGER_CONTRACT_ADDRESS, parseEther("10000000000")], // Arguments: spender address and approval amount
  })

  // Call the createNewAuditTask function on the SERVICE_MANAGER_CONTRACT_ADDRESS
  writeContract({
    address: SERVICE_MANAGER_CONTRACT_ADDRESS, // Address of the Insurance contract
    abi: parseAbi(["function createNewAuditTask(address contractAddress)"]), // ABI for createNewAuditTask
    functionName: "createNewAuditTask", // Function to call
    args: [contractAddress], // Arguments: contract address to audit
  })
}

/**
 * @notice Submits a new insurance task by approving the insurance contract and then creating the task with specified parameters.
 * @param {number} submissionId - The ID of the submission.
 * @param {string | number} coverageAmount - The amount of coverage desired.
 * @param {number} duration - The duration of the insurance coverage.
 */
async function submitInsuranceTx(submissionId, coverageAmount, duration) {
  // Approve the SERVICE_MANAGER_CONTRACT_ADDRESS to spend a large amount of QUILL tokens on behalf of the user
  writeContract({
    address: QUILLTOKEN_ADDRESS, // Address of the QUILLTOKEN contract
    abi: parseAbi(["function approve(address spender, uint256 amount)"]), // ABI for the approve function
    functionName: "approve", // Function to call
    args: [SERVICE_MANAGER_CONTRACT_ADDRESS, parseEther("10000000000")], // Arguments: spender address and approval amount
  })

  // Call the createNewInsuranceTask function on the SERVICE_MANAGER_CONTRACT_ADDRESS with the specified parameters
  writeContract({
    address: SERVICE_MANAGER_CONTRACT_ADDRESS, // Address of the Insurance contract
    abi: parseAbi([
      "function createNewInsuranceTask(uint256 _submissionId,uint256 _coverageAmount,uint256 _duration)",
    ]), // ABI for createNewInsuranceTask
    functionName: "createNewInsuranceTask", // Function to call
    args: [submissionId, parseEther(coverageAmount), duration], // Arguments: submission ID, coverage amount, and duration
  })
}

/**
 * @notice Allows a policy owner to file a claim by providing the policy ID and evidence IPFS hash.
 * @param {number} policyId - The ID of the policy being claimed.
 * @param {string} evidenceHash - The IPFS hash of the evidence supporting the claim.
 */
async function submitFileCloan(policyId, evidenceHash) {
  // Call the fileClaim function on the SERVICE_MANAGER_CONTRACT_ADDRESS with the policy ID and evidence hash
  writeContract({
    address: SERVICE_MANAGER_CONTRACT_ADDRESS, // Address of the Insurance contract
    abi: parseAbi([
      "function fileClaim(uint256 _policyId,string memory _evidenceIPFSHash)",
    ]), // ABI for fileClaim
    functionName: "fileClaim", // Function to call
    args: [policyId, evidenceHash], // Arguments: policy ID and evidence IPFS hash
  })
}
