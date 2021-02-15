<template>
    <div class="wrapper">
        <ul class="list-errors">
            <li class="error" v-for="error in errors" v-bind:key=error.id>
                <transition name="slide-fade">
                    <p v-if="error.id >= lowest"><span>{{error.status}}</span> {{error.msg}}</p>
                </transition>

            </li>
        </ul>
    </div>
</template>

<style scoped>
.wrapper {
    position: absolute;
    bottom: 0;
    right: 0;
}
ul {
    list-style-type: none;
}
.status-icon {
  width: 1em;
}
.list-error {
    padding-left: 40px;
}
.error {
    color: red;
}
.slide-fade-enter-active {
  transition: all .8s ease;
}
.slide-fade-leave-active {
  transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.slide-fade-enter, .slide-fade-leave-to {
  opacity: 0;
}
</style>

<script lang="ts">
import store, { Error, ErrorState } from '../store'

export default {
    name: "Errors",
    data(): {state: {[id: number]: Error}, lowest: number} {
        return {
            state: {},
            lowest: 0,
        };
    },
    computed: {
        errors(): {[id: number]: Error} {
            const store_errors = this.$store.state.errors;
            let lowest = 1000000;

            for(let error of store_errors) {
                lowest = lowest < error.id ? lowest : error.id;
                this.state[error.id] = error;
            }

            this.lowest = lowest;

            return this.state;
        }
    }
}
</script>
