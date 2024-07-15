import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import {SolanaWorkPractice} from "../target/types/solana_work_practice";

describe("solana-work-practice", () => {

  // Configure the client to use the local cluster.
  // Configure the Anchor provider & load the program IDL
  // The IDL gives you a typescript module
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.SolanaWorkPractice as Program<SolanaWorkPractice>;

  it("Is initialized!", async () => {
    // Add your test here.
    const tx = await program.methods
    .initialize()
    .rpc();

    console.log("Tx signature:", tx);
  });

  it("Say Hello, Anchor!", async() => {
    // Just run Anchor's IDL method to build a transaction!
    await program.methods
    .sayHello()
    .accounts({}).rpc();

  });

});
