from fastapi import FastAPI
from version import version
from starlette.responses import RedirectResponse

description = """
Top Ten API
"""

top_ten_app = FastAPI(title="Top Ten API",
                      description=description,
                      version=version)


@top_ten_app.get("/")
def root() -> RedirectResponse:
    """
    API call to get to the root page. Redirects to the auto-generated 'docs' page.
    """
    return RedirectResponse(url="docs")
