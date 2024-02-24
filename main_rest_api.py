import uvicorn
import argparse

from app.app import top_ten_app

if __name__ == '__main__':
    parser = argparse.ArgumentParser(
        description="Start the REST API.",
        formatter_class=argparse.RawTextHelpFormatter)
    parser.add_argument("-i",
                        "--ip",
                        help="IP address on which to find the application.",
                        type=str,
                        default="0.0.0.0")
    parser.add_argument("-p",
                        "--port",
                        help="Port on which to find the application.",
                        type=int,
                        default=80)

    args = parser.parse_args()
    uvicorn.run(app=top_ten_app, host=args.ip, port=args.port)
