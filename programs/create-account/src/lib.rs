use anchor_lang::prelude::*;
use anchor_lang::system_program::{create_account, CreateAccount};

declare_id!("AvVcSu6j4GGV7FD5XCjoHL8t2E6VhRsnJKzoPRU7nbXG");

#[program]
pub mod create_account {

    use super::*;


    pub fn create_system_account(ctx: Context<CreateSystemAccount>) -> Result<()> {
        
        msg!("Creating a system account ...");
        msg!("This program's Program ID: {}", &id());

        let new_pub_key = &ctx.accounts.new_account.key().to_string();
        msg!("  New public key will be: {}", new_pub_key);

        let ctx = CpiContext::new(
            ctx.accounts.system_program.to_account_info(), 
            CreateAccount {
                from: ctx.accounts.payer.to_account_info(),
                to: ctx.accounts.new_account.to_account_info(),
            },
        );
        let lamports = Rent::get()?.minimum_balance(0);
        let space: u64 = 0;
        //let owner = &ctx.accounts.system_program.key();
        let owner = &id();
        msg!("id:{}", owner);

        create_account(ctx, lamports, space, owner)?;

        msg!("Account Created Successfully. √");
        Ok(())
    }
}


#[derive(Accounts)]
pub struct CreateSystemAccount<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,
    #[account(mut)]
    pub new_account: Signer<'info>,
    pub system_program: Program<'info, System>,
}
