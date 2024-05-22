import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import {SolanaWork} from "../target/types/solana_work";

describe("solana-work", () => {

  // Configure the client to use the local cluster.
  // Configure the Anchor provider & load the program IDL
  // The IDL gives you a typescript module
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const program = anchor.workspace.SolanaWork as Program<SolanaWork>;

  it("Is initialized!", async () => {
    // Add your test here.
    const tx = await program.methods
    .initialize()
    .rpc();

    console.log("Tx signature: ", tx);
  });

  it("Say Hello, Solana!", async() => {
    // Just run Anchor's IDL method to build a transaction!
    await program.methods
    .hello()
    .accounts({}).rpc();

  });

});
