/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental : {
        staleTimes : {
            dynamic :0
        }
    },
    eslint : {
        ignoreBuildErrors : true
    }

};

export default nextConfig;
