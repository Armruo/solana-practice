use {
       anchor_lang::prelude::*,
       anchor_spl::{
           associated_token::AssociatedToken,
           token::{mint_to, Mint, MintTo, Token, TokenAccount},
       },
};

pub fn mint_token(ctx: Context<MintToken>, amount: u64) -> Result<()> {

       let mint_amount = amount * 10u64.pow(ctx.accounts.mint_account.decimals as u32);

       mint_to(
              CpiContext::new(
                     ctx.accounts.token_program.to_account_info(),
                     MintTo {
                     mint: ctx.accounts.mint_account.to_account_info(),
                     to: ctx.accounts.associated_token_account.to_account_info(),
                     authority: ctx.accounts.mint_authority.to_account_info(),
                     },
              ),
              mint_amount
       )?;

       
       Ok(())
}

   
#[derive(Accounts)]
pub struct MintToken<'info> {
       #[account(mut)]
       pub mint_authority: Signer<'info>,

       #[account(mut)]
       pub mint_account: Account<'info, Mint>,

       pub recipient: SystemAccount<'info>,
       
       #[account(
              init_if_needed,
              payer = mint_authority,
              associated_token::mint = mint_account,
              associated_token::authority = recipient,
       )]
       pub associated_token_account: Account<'info, TokenAccount>,

       pub token_program: Program<'info, Token>,
       pub associated_token_program: Program<'info, AssociatedToken>,
       pub system_program: Program<'info, System>,
}


