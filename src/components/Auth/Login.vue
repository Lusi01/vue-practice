<template>
    <v-container fluid fill-height>
        <v-layout align-center justify-center>
            <v-flex xs12 sm8 md6>
                <v-card class="elevation-12">
                    <v-toolbar dark color="primary">
                        <v-toolbar-title>Login form</v-toolbar-title>
                        <!--<v-spacer></v-spacer>-->
<!--
                        <v-tooltip bottom>
                            <v-btn
                                    slot="activator"
                                    :href="source"
                                    icon
                                    large
                                    target="_blank"
                            >
                                <v-icon large>code</v-icon>
                            </v-btn>
                            <span>Source</span>
                        </v-tooltip>
-->
<!--
                        <v-tooltip right>
                            <v-btn slot="activator" icon large href="https://codepen.io/johnjleider/pen/wyYVVj" target="_blank">
                                <v-icon large>mdi-codepen</v-icon>
                            </v-btn>
                            <span>Codepen</span>
                        </v-tooltip>
-->
                    </v-toolbar>

                    <v-card-text>
                        <v-form ref="form" v-model="valid" validation>
                            <v-text-field
                                    prepend-icon="person"
                                    name="email"
                                    label="Email"
                                    type="email"
                                    v-model="email"
                                    :rules="emailRules"
                            ></v-text-field>
                            <v-text-field
                                    prepend-icon="lock"
                                    name="password"
                                    label="Password"
                                    type="password"
                                    v-model="password"
                                    :counter="6"
                                    :rules="passwordRules"
                            ></v-text-field>
                        </v-form>
                    </v-card-text>

                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn
                                color="primary"
                                @click="onSubmit"
                                :loading="loading"
                                :disabled="!valid  || loading"
                        >Login</v-btn>
                    </v-card-actions>
                </v-card>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
    export default {
        data () {
            return {
                email: '',
                password: '',
                valid: false,
                emailRules: [
                    v => !!v || 'E-mail is required',
                    v => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) || 'E-mail must be valid'
                ],
                passwordRules: [
                    v => !!v || 'Password is required',
                    v => (v && v.length >= 6) || 'Password must be equal or more than 6 characters'
                ],
            }
        },

        computed: {
            loading () {
                return this.$store.getters.loading
            }
        },

        methods: {
            onSubmit() {
                if (this.$refs.form.validate()) {
                    const  user = {
                        email: this.email,
                        password: this.password
                    }

                    //console.log(user)
                    this.$store.dispatch('loginUser', user)
                        .then(() => {
                            this.$router.push('/')//перейти на главную страницу в случае успеха
                        })
                        .catch(() => {})
                }
            }
        },

        created() {
            if (this.$route.query['loginError']) {
                this.$store.dispatch('setError', 'Please log in to access this page')
            }
        }
    }
</script>


<style scoped>

</style>