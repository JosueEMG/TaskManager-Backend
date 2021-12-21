import app from './app'
import './database'

(async () => {
    await app.listen(app.get('port'))
    console.log(`Server on port ${app.get('port')}`)
})()
