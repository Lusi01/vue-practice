<template>
    <v-container>
        <v-layout row>
            <v-flex xs12 class="text-xs-center" pt-5 v-if="loading">
                <v-progress-circular
                        :size="100"
                        :width="4"
                        color="purple"
                        indeterminate
                ></v-progress-circular>
            </v-flex>
            <v-flex xs12 sm6 offset-sm3 v-else-if="!loading && orders.length !== 0">
                <h1 class="text--secondary mb-3">Orders</h1>

                <v-list two-line subheader >

                    <v-list-tile
                            avatar
                            v-for="order in orders"
                            :key="order.id"

                    >

                        <v-list-tile-action>
                            <v-checkbox
                                color="success"
                                :input-value="order.done"
                                @change="markDone(order)"
                            ></v-checkbox>
                        </v-list-tile-action>

                        <v-list-tile-content>
                            <v-list-tile-title>{{ order.name }}</v-list-tile-title>
                            <v-list-tile-sub-title>{{ order.phone }}</v-list-tile-sub-title>
                        </v-list-tile-content>

                        <v-list-tile-action>
                            <v-btn
                                    :to="'/ad/' + order.adId"
                                    class="primary">Open</v-btn>
                        </v-list-tile-action>

                    </v-list-tile>

                </v-list>

            </v-flex>

            <v-flex xs12 class="text-xs-center" v-else>
                <h1 class="text--secondary">You have no orders</h1>
            </v-flex>

        </v-layout>
    </v-container>
</template>

<script>
    export default {

        /*data () {
            return {
                orders: [
                    {
                        id: 'fds3',
                        name: 'Vlad',
                        phone: '8-921-121-12-12',
                        adId: '123',
                        done: false
                    }
                ]
            }
        },*/

        computed: {
            loading () {
                this.$store.dispatch('fetchOrders')
                return this.$store.getters.loading
            },

            orders () {
                console.log('computed')
                return this.$store.getters.orders
            }
        },

        methods: {
            markDone(order) {
                this.$store.dispatch('markOrderDone', order.id)
                    .then(() => {
                        order.done = true
                    })
                    .catch(() => {})

            },

            created () {
                console.log('created')
                this.$store.dispatch('fetchOrders')
            }
        }
    }
</script>

<style scoped>
</style>