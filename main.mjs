import * as util from 'node:util'

function validate() {
  try {
    if ( process.env?.YT_API_KEY === undefined ) {
      throw new Error('API key is not set error.')
    }
  } catch(e) {
    console.error(e.message)
    console.info('You must specify the YouTube Data API v3 API key in your .env as shown below.')
    console.info('YT_API_KEY=YOUR_API_KEY')
    process.exitCode = 1
    return false
  }
  try {
    const { positionals } = util.parseArgs({ allowPositionals: true })
    if ( positionals.length === 0 ) {
      throw new Error('Keyword is not set error.')
    }
  } catch (e) {
    console.error(e.message)
    console.info('Requires a keyword as an argument')
    process.exitCode = 1
    return false
  }
  return true
}

function run() {
  if ( !validate() ) {
    return
  }
  const apiKey = process.env.YT_API_KEY
  const searchTerm = util.parseArgs({ allowPositionals: true }).positionals[0]
  
  const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${searchTerm}&key=${apiKey}`
  
  const response = fetch(url)
  response.then(res => res.json())
    .then(json => {
      json.items.forEach(item => {
        console.log(item.snippet.title)
      })
    })
}

run()
