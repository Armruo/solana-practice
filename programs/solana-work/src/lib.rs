use anchor_lang::prelude::*;
use anchor_lang::system_program::{create_account, CreateAccount};
// use log::info;

declare_id!("Bv33hU1UuzxBbtB3EXST7d39hFQfBA3aY6NYqYLMtEv1");

#[program]
pub mod solana_work {

    use super::*;

    pub fn initialize(_ctx: Context<Initialize>) -> Result<()> {
        Ok(())
    }

    pub fn hello(_ctx: Context<Hello>) -> Result<()> {

        msg!("Hello, Solana!");
        msg!("Our program's Program ID: {}", &id());

        Ok(())
    }

    pub fn create_system_account(ctx: Context<CreateSystemAccount>) -> Result<()> {
        msg!("Creating a system account ...");

        let new_pub_key = &ctx.accounts.new_account.key().to_string();
        msg!("  New public key will be: {}", new_pub_key);

        let lamports = Rent::get()?.minimum_balance(0);
        let space: u64 = 0;
        let owner = &ctx.accounts.system_program.key();

        create_account(
            CpiContext::new(
                ctx.accounts.system_program.to_account_info(), 
                CreateAccount {
                    from: ctx.accounts.payer.to_account_info(),
                    to: ctx.accounts.new_account.to_account_info()
                }
            ), 
            lamports, 
            space, 
            owner
        )?;

        msg!("Account Created Successfully. √");
        Ok(())
    }


}

#[derive(Accounts)]
pub struct Initialize {}

#[derive(Accounts)]
pub struct Hello {}

#[derive(Accounts)]
pub struct CreateSystemAccount<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,
    #[account(mut)]
    pub new_account: Signer<'info>,
    pub system_program: Program<'info, System>,
}
