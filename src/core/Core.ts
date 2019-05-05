namespace Soo {

    let version: string = "@VERSION";
    export let ID: string = `Soo${(version + Math.random()).replace( /\D/g, "" )}`;
}