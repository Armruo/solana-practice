import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { SolanaWork } from "../target/types/solana_work";
import { Connection, Keypair, SystemProgram } from "@solana/web3.js";
import { assert } from "chai";

describe("solana-work", () => {

  // Configure the client to use the local cluster.
  // Configure the Anchor provider & load the program IDL
  // The IDL gives you a typescript module
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const program = anchor.workspace.SolanaWork as Program<SolanaWork>;

  const wallet = provider.wallet as anchor.Wallet
  const connection = provider.connection

  it("Is initialized!", async () => {
    // Add your test here.
    const tx = await program.methods
    .initialize()
    .rpc();

    console.log("initialize(): Tx Signature: ", tx);
  });

  it("Say Hello!", async() => {
    // Just run Anchor's IDL method to build a transaction!
    await program.methods
    .hello()
    .accounts({})
    .rpc();

  });

  it("Create the System Account", async () => {
    // 为新账户生成一个新keypair
    const newKeypair = new Keypair()

    await program.methods
    .createSystemAccount()
    .accounts({
      payer: wallet.publicKey,
      newAccount: newKeypair.publicKey,
    })
    .signers([newKeypair]) // 签名
    .rpc()

    const lamports = await connection.getMinimumBalanceForRentExemption(0)
    const accountInfo = await connection.getAccountInfo(newKeypair.publicKey)

    // 检查账户
    assert((accountInfo.owner = SystemProgram.programId))
    assert(accountInfo.lamports === lamports)

  })



});
