import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { CreateAccount } from "../target/types/create_account";
import { Connection, Keypair, SystemProgram } from "@solana/web3.js";
//import { assert } from "chai";

describe("create-account", () => {

  // Configure the client to use the local cluster.
  // Configure the Anchor provider & load the program IDL
  // The IDL gives you a typescript module
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const program = anchor.workspace.CreateAccount as Program<CreateAccount>;


  const wallet = provider.wallet as anchor.Wallet
  const connection = provider.connection
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
    const accountInfo = await connection.getAccountInfo(newKeypair.publicKey);
    console.log("account info:{}", accountInfo);
    // 检查账户
    expect(accountInfo.owner.toBase58).toEqual(program.programId.toBase58);
    //assert.equal(accountInfo.owner.toBase58, program.programId.toBase58);
    //assert((accountInfo.owner = SystemProgram.programId))
    expect(accountInfo.lamports).toEqual(lamports);
    //assert.equal(accountInfo.lamports, lamports);

  })



});
