import * as anchor from "@coral-xyz/anchor";
import { Connection, Keypair, PublicKey, Transaction } from "@solana/web3.js";
import * as spl from '@solana/spl-token';
import { TokenMinter } from "../target/types/token_minter";

describe("Token Minter", () => {
       const provider = anchor.AnchorProvider.env();
       anchor.setProvider(provider);

       const payer = provider.wallet as anchor.Wallet;
       const program = anchor.workspace.TokenMinter as anchor.Program<TokenMinter>;

       const tokenMetadata = {
              name: "Suan Test",
              symbol: "SUAN",
              uri: "../datas/suan-token.json"
       }

       const [MintPDA] = PublicKey.findProgramAddressSync(
              [Buffer.from("mint")],
              program.programId
       );

       let METADATA_PROGRAM = new PublicKey('metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s');
       let NFT_MINT = new PublicKey("9SZDmrpJuyKKaFqkWqFYMi5KspYB9THZnmZrQ2zM2nap"); // solana主网上随便找的一个NFT
       // 连接：solana-test-validator -r --bpf-program metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s metadata.so --account 9SZDmrpJuyKKaFqkWqFYMi5KspYB9THZnmZrQ2zM2nap datas/test-nft.json  --account metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s datas/metadata.json

       // 查看Metadata的PDA 
       // (输出结果：HNhBsvxRiMfszABEV1aMY7Lzk8zfTczKuWPusaVSm5ky)
       it("0. Get Metadata PDA:", async() => {
              const getMetadataAddress = async (mint) => {
                     return PublicKey.findProgramAddressSync(
                         [Buffer.from("metadata"), METADATA_PROGRAM.toBuffer(), mint.toBuffer()],
                         METADATA_PROGRAM
                     )
              }

              getMetadataAddress(NFT_MINT).then(([metadata, bump]) => {
                     console.log("metadata: ", metadata.toBase58())
              }).catch(console.error);
       });
       // 如果create token异常，如：Error Number: 3009. Error Message: Program account is not executable
       // 运行 solana account -u m HNhBsvxRiMfszABEV1aMY7Lzk8zfTczKuWPusaVSm5ky --output-file datas/metadata.json --output json-compact


       it("1. Create a token:", async() => {
              console.log("<-- Creating an SPL token... -->");
              const mintKeypair = new Keypair();

              const txSign = await program.methods
              .createToken(
                     9,
                     tokenMetadata.name, tokenMetadata.symbol, tokenMetadata.uri)
              .accounts({
                     payer: payer.publicKey, 
                     mintAccount: mintKeypair.publicKey})
              .signers([mintKeypair])
              .rpc();

              console.log("Success √")
              console.log(`   Mint Address: ${mintKeypair.publicKey}`);
              console.log(`   Tx Signature: ${txSign}`);
       })


       // NFT：设置精度为0就行
       it("2. Create an NFT:", async () => {
              console.log("<-- Creating an NFT... -->");
              const mintKeypair = new Keypair();

              const txSign = await program.methods
              .createToken(
                     0, 
                     tokenMetadata.name, tokenMetadata.symbol, tokenMetadata.uri)
              .accounts({
                     payer: payer.publicKey,
                     mintAccount: mintKeypair.publicKey})
              .signers([mintKeypair])
              .rpc();
              
              console.log("Success √");
              console.log(`   Mint Address: ${mintKeypair.publicKey}`);
              console.log(`   Tx Signature: ${txSign}`);
       });


       // it("3. Mint some tokens to wallet:", async () => {
       //        console.log("<---------- Minting some tokens to wallet... ---------->")
              
       //        const associatedTokenAccountAddress = spl.getAssociatedTokenAddressSync(
       //               MintPDA,
       //               payer.publicKey
       //        );

       //        const amount = new anchor.BN(100);

       //        console.log(`MintPDA: ${MintPDA}`);
       //        console.log(`Associated Token Account Address: ${associatedTokenAccountAddress}`);
       //        console.log(`recipient: ${payer.publicKey}`)

       //        // let tx = new Transaction();

       //        // tx.add(await program.methods.mintToken(amount).accounts({
       //        //               mintAuthority: payer.publicKey,
       //        //               recipient: payer.publicKey,
       //        //               mintAccount: mintKeypair.publicKey,
       //        //               associatedTokenAccount: associatedTokenAccountAddress})
       //        //        .instruction()
       //        // );
       //        // await program.provider.sendAndConfirm(tx, );
              
       //        const txSign = await program.methods
       //        .pdaMintToken(amount)
       //        .accounts({
       //               payer: payer.publicKey,
       //               associatedTokenAccount: associatedTokenAccountAddress,
       //        })
       //        .rpc();
          
       //        console.log("Success!");
              
       //        console.log(`   Tx Signature: ${txSign}`);
       // });




})