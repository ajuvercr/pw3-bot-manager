<template>
    <div class="wrapper">
        <ul class="list-errors">
            <li class="error" v-for="error in errors" v-bind:key=error.id>
                <transition name="slide-fade">
                    <p v-if="error.show"><span>{{error.status}}</span> {{error.msg}}</p>
                </transition>

            </li>
        </ul>
    </div>
</template>

<style scoped>
.wrapper {
    position: absolute;
    bottom: 20px;
    right: 30px;
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
import { ErrorT, State } from '../store';
export default {
    name: "Errors",
    computed: {
        errors(): State<ErrorT> {
            return this.$store.state.errors;
        }
    }
}
</script>
