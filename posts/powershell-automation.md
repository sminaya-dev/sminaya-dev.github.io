---
title: Automating User Onboarding
date: Jan 28
---

# Why I Wrote an Onboarding Tool

In my lab, I needed to create 50+ users for a "Sales" department. Doing this manually in _Active Directory Users and Computers_ (ADUC) was slow and error-prone.

I wrote a PowerShell tool (`New-ADUser.ps1`) to standardize this process.

## Key Features

### 1. Defensive Coding (Pre-Flight Checks)

Scripts shouldn't run blindly. My script validates the environment before attempting any changes.

```powershell
# Check if the OU actually exists before trying to create a user there
if (-not (Get-ADOrganizationalUnit -Identity $OU)) {
    Throw "The target OU was not found: $OU"
}
```

### 2. Handling Collisions

In a real company, you will eventually hire two people named "John Smith." My script detects if `jsmith` exists and warns the operator.

### 3. Role-Based Access Control (RBAC)

Early versions of my script tried to modify the "Primary Group" attribute. I learned through research that this is a legacy attribute from the NT4 days. The modern, correct method is using the `Add-ADGroupMember` cmdlet.

```powershell
if ($SecurityGroup) {
    Add-ADGroupMember -Identity $SecurityGroup -Members $UserName
}
```

## The "Splatting" Technique

To make the code readable, I used a technique called **Splatting**. Instead of one long line of code, I define parameters in a hash table:

```powershell
$UserParams = @{
    SamAccountName = $UserName
    Name           = "$FirstName $LastName"
    Path           = $OU
    Enabled        = $true
}

New-ADUser @UserParams
```

This tool reduced the time to onboard a batch of users from 30 minutes to seconds.
