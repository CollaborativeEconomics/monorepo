import { beforeAll, afterEach, afterAll } from 'bun:test'
import server from './mocks/serverMock'

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())