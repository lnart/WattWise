import { test, expect } from '@playwright/test'
import * as db from '../src/controller/dbController'

test('register page has title', async({page}) => {
    await page.goto('http://localhost:8000/register')
    const headline = page.getByTestId('headline')

    await expect(page).toHaveTitle(/Registration Form/)
    await expect(headline).toContainText('Create Account')

})

test('create user account with wrong email adress', async({page}) => {
    await page.goto('http://localhost:8000/register')
    await page.getByTestId('firstname').fill('max')
    await page.getByTestId('lastname').fill('mustermann')
    await page.getByTestId('email').fill('lola@pafel')
    await page.getByTestId('zipcode').fill('10963')
    await page.getByTestId('password').fill('mustermann')
    await page.getByTestId('registerbutton').click()
    const message = page.getByText('Email Adress is already in use')

    await expect(message).toContainText('Email Adress is already in use')

})

test('create user account', async({page}) => {
    await db.deleteUser('max@mustermann')
    await page.goto('http://localhost:8000/register')
    await page.getByTestId('firstname').fill('max')
    await page.getByTestId('lastname').fill('mustermann')
    await page.getByTestId('email').fill('max@mustermann')
    await page.getByTestId('zipcode').fill('10963')
    await page.getByTestId('password').fill('mustermann')
    await page.getByTestId('registerbutton').click()
    const message = page.getByTestId('headline')

    await expect(page).toHaveTitle(/Login Page/)
    await expect(message).toContainText('Login')
})

test('Login with user account', async({page}) => {
  await page.goto('http://localhost:8000/login')
  await page.getByTestId('email').fill('max@mustermann')
  await page.getByTestId('password').fill('mustermann')
  await page.getByTestId('loginbutton').click()
  await expect(page).toHaveTitle(/Dashboard/)
})

test('login with wrong password', async({page}) => {
    await page.goto('http://localhost:8000/login')
    await page.getByTestId('email').fill('max@mustermann')
    await page.getByTestId('password').fill('mumpitz')
    await page.getByTestId('loginbutton').click()
    const message = page.getByTestId('message')
    await expect(message).toContainText('Wrong Password')
})

test('login with wrong email', async({page}) => {
    await page.goto('http://localhost:8000/login')
    await page.getByTestId('email').fill('false@email')
    await page.getByTestId('password').fill('mustermann')
    await page.getByTestId('loginbutton').click()
    const message = page.getByTestId('message')
    await expect(message).toContainText('Email Doesnt Exist')
})
