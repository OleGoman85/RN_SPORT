import { Redis } from '@upstash/redis'
import {Ratelimit} from '@upstash/ratelimit'

import "dotenv/config"

const ratelimit = new Ratelimit({
	redis:Redis.fromEnv(),
	limiter: Ratelimit.slidingWindow(100, "60 s") //amount of requests in a 60s
})

export default ratelimit


//upstash.com Redis
