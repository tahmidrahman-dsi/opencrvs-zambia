import fetch from 'node-fetch'
import { set } from 'lodash'
import { Database } from '@ocrvs-chatbot/database'
import * as TelegramBot from 'node-telegram-bot-api'
import { getLoggedInUser } from '@ocrvs-chatbot/utils/auth'
import { MEDIATOR_URL } from '@ocrvs-chatbot/constants'

export interface ISearchParams {
  child?: {
    firstName?: string
    lastName?: string
    gender?: 'male' | 'female' | 'unknown'
  }
  mother?: {
    firstName?: string
    lastName?: string
  }
  eventLocation?: {
    name: string
  }
}

export async function getSearchParams(chatId: number): Promise<ISearchParams> {
  const searchParams = await Database.get(`search_params_${chatId}`)
  return JSON.parse(searchParams) as ISearchParams
}

export async function storeSearchParams(
  chatId: number,
  path: string,
  value: string
) {
  let searchParams = await getSearchParams(chatId)
  if (!searchParams) {
    searchParams = {}
  }
  set(searchParams, path, value)

  await Database.set(`search_params_${chatId}`, JSON.stringify(searchParams))
}

export async function search(
  msg: TelegramBot.Message,
  chatId: number
): Promise<any> {
  try {
    const chatbotUser = await getLoggedInUser(msg)
    const searchParams = await getSearchParams(chatId)
    if (chatbotUser && chatbotUser.token) {
      await fetch(`${MEDIATOR_URL}/search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${chatbotUser.token}`
        },
        body: JSON.stringify(searchParams)
      })
    } else {
      throw new Error('Chatbot user could not be found')
    }
  } catch (err) {
    throw new Error('Could not perform search on mediator')
  }
}