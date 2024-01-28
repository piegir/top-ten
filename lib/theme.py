class Theme:

    def __init__(self, index: int, title: str, top1: str, top10: str):
        self.index: int = index
        self.title: str = title
        self.top1: str = top1
        self.top10: str = top10

    def __str__(self) -> str:
        return f"{self.title}\nTop 1 : {self.top1}\nTop 10 : {self.top10}"
