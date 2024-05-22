use anchor_lang::prelude::*;
use anchor_lang::system_program::{create_account, CreateAccount};

declare_id!("DKh62tAeLiwUJhnxN1zCxycJa9pVAHY5RRTqJ2XrMP7A");

#[program]
pub mod solana_work {
    use anchor_lang::{solana_program::stake::instruction::create_account, system_program::CreateAccount};

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

        let new_pub_key: str = &ctx.accounts.new_acount.key().to_string();
        msg!("  New public key will be: {}", new_pub_key);

        let ctx = CpiContext::new(
            program = ctx.accounts.system_program.to_account_info(), 
            accounts = CreateAccount {
                from: ctx.accounts.payer.to_account_info(),
                to: ctx.accounts.new_account.to_account_info(),
            },
        );
        let lamports = Rent::get()?.minimum_balance(0);
        let space: u64 = 0;
        let owner = &ctx.accounts.system_program.key();

        create_account(ctx, lamports, space, owner)?;

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
