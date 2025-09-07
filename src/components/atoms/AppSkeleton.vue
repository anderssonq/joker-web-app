<template>
    <span class="skeleton">
        &zwnj;
        <p>Loading...</p>
    </span>
</template>

<style scoped>
.skeleton {
    border-radius: 12px;
    text-align: center;
    align-content: center;
    background-color: #eee;
    background-image: linear-gradient(90deg, #eee, #f5f5f5, #eee);
    background-size: 200px 100%;
    background-repeat: no-repeat;
    border-radius: 4px;
    display: inline-block;
    line-height: 1;
    width: 100%;
    height: 50px;
    margin: 14px 0px 14px;
    animation: skeleton-animation 1.5s ease-in-out infinite;
    cursor: progress;
}

@keyframes skeleton-animation {
    0% {
        background-position: -200px 0;
    }

    100% {
        background-position: calc(200px + 100%) 0;
    }
}
</style>
