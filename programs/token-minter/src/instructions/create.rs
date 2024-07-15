use {
       anchor_lang::prelude::*,
       anchor_spl::{
           metadata::{
               create_metadata_accounts_v3, mpl_token_metadata::types::DataV2, CreateMetadataAccountsV3, Metadata
           },
           token::{Mint, Token},
       },
};
   
   
pub fn create_token(
       ctx: Context<CreateToken>, 
       _token_decimals: u8, // decimals=9：Token；decimals=0：NFT，灵活测试
       token_name: String, token_symbol: String, token_uri: String
) -> Result<()> {

       msg!("Creating metadata account ....");
       msg!("Metadata account address: {}", &ctx.accounts.metadata_account.key());

       let account_v3 = CreateMetadataAccountsV3 {
              metadata: ctx.accounts.metadata_account.to_account_info(),
              mint: ctx.accounts.mint_account.to_account_info(),
              mint_authority: ctx.accounts.payer.to_account_info(),
              update_authority: ctx.accounts.payer.to_account_info(),
              payer: ctx.accounts.payer.to_account_info(),
              system_program: ctx.accounts.system_program.to_account_info(),
              rent: ctx.accounts.rent.to_account_info(),
       };

       let data_v2 = DataV2 {
              name: token_name,
              symbol: token_symbol,
              uri: token_uri,
              seller_fee_basis_points: 0,
              creators: None,
              collection: None,
              uses: None,
       };

       create_metadata_accounts_v3(
              CpiContext::new(
              ctx.accounts.token_metadata_program.to_account_info(),
              account_v3,
              ), // ctx 
              data_v2, // data
              false, // is_mutable
              true, // update_authority_is_signer 
              None // collection_details
       )?;

       msg!("Token created successfully.");

       Ok(())
}


#[derive(Accounts)]
#[instruction(_token_decimals: u8)]
pub struct CreateToken<'info> {
#[account(mut)]
       pub payer: Signer<'info>,

       // PDA
       #[account(
              mut,
              seeds = [b"metadata", token_metadata_program.key().as_ref(), mint_account.key().as_ref()],
              bump,
              seeds::program = token_metadata_program.key(),
       )]
       /// CHECK: Metaplex Account 此账户不需要安全检查，通过PDA来验证地址
       pub metadata_account: UncheckedAccount<'info>,

       #[account(
              init,
              payer = payer,
              mint::decimals = _token_decimals,
              mint::authority = payer.key(),
       )]
       pub mint_account: Account<'info, Mint>,

       pub token_program: Program<'info, Token>,
       pub token_metadata_program: Program<'info, Metadata>,
       pub system_program: Program<'info, System>,

       pub rent: Sysvar<'info, Rent>
}
   
   