/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental : {
        staleTimes : {
            dynamic :0
        }
    },
    typescript : {
        ignoreBuildErrors : true
    },
    eslint : {
        ignoreBuildErrors : true
    }

};

export default nextConfig;
