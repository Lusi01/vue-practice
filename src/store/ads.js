import * as fb from 'firebase'

class Ad {
    constructor(title, description, ownerId, imageSrc = '', promo = false, id = null) {
        this.title = title,
        this.description = description,
        this.ownerId = ownerId,
        this.imageSrc = imageSrc,
        this.promo = promo,
        this.id = id
    }
}

export default {
    state: {
        ads: []
    },

    mutations: {
        createAd (state, payload) {
            state.ads.push(payload)
        },

        loadAds (state, payload) {
            state.ads = payload
        },

        updateAd (state, {title, description, id}) {
            //обновить существующий объект в массиве ads
            //сначала находим этот id в массиве ads - первый попавшийся
            const ad = state.ads.find(a => {
                return a.id === id
            })

            //переопределяем поля:
            ad.title = title
            ad.description = description
        }
    },

    actions: {
        async createAd({commit, getters}, payload) {
            // payload.id = 'qqqwww'
            commit('clearError')
            commit('setLoading', true)
            // console.log(getters)

            const image = payload.image

            try {
                const newAd = new Ad(
                    payload.title,
                    payload.description,
                    getters.user.id,
                    '',
                    payload.promo
                )

                const ad = await fb.database().ref('ads').push(newAd)
                const imageExt = image.name.slice(image.name.lastIndexOf('.')+1)
//console.log(imageExt)
                const fileData = await fb.storage().ref(`ads/${ad.key}.${imageExt}`).put(image)

                var iii = []
                //    const imageSrc = fileData. metadata.downloadURLs[0]
                const imageSrc = await fb.storage().ref(`ads/${ad.key}.${imageExt}`).getDownloadURL()

                //console.log(iii)
                //console.log(imageSrc.valueOf())

                await fb.database().ref('ads').child(ad.key).update({
                    imageSrc
                })

                commit('setLoading', false)

                commit('createAd', {
                    ...newAd,
                    id: ad.key,
                    imageSrc //или можно просто imageSrc: imageSrc
                })

            } catch (error) {
                commit('setError', error.message)
                commit('setLoading', false)
                throw error
            }
        },

        async fetchAds({commit}) {
            commit('clearError')
            commit('setLoading', true)

            const resultAds = []

            try {

                const fbVal = await fb.database().ref('ads').once('value')
                //console.log(fbVal)
                const ads = fbVal.val()
                //console.log(ads)

                Object.keys(ads).forEach(key => {
                    const ad = ads[key]
                    resultAds.push(
                        new Ad(ad.title, ad.description, ad.ownerId, ad.imageSrc, ad.promo, key)
                    )
                })

                commit('loadAds', resultAds)

                commit('setLoading', false)
            } catch (error) {
                commit('setError', error.message)
                commit('setLoading', false)
                throw error
            }
        },

        async updateAd ({commit}, {title, description, id}) {
            commit('clearError')
            commit('setLoading', true)

            try {
                await fb.database().ref('ads').child(id).update({
                    title, description
                })
                commit('updateAd', {
                    title, description, id
                })

                commit('setLoading', false)
            } catch (error) {
                commit('setError', error.message)
                commit('setLoading', false)
                throw error
            }
        }

    },

    getters: {
        ads(state) {
            return state.ads
        },

        promoAds(state) {
            return state.ads.filter(ad => {
                return ad.promo
            })
        },

        myAds(state, getters) {
            //потом отфильтруем только те объявления, которые принадлежат моему юзеру
            //return state.ads
            //отфильтруем только те объявления, которые принадлежат моему юзеру
            return state.ads.filter(ad => {
                return ad.ownerId === getters.user.id
            })
        },
        adById(state) {
            return adId => {
                return state.ads.find(ad => ad.id === adId)
            }
        }
    }
}