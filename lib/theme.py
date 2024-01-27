class Theme:

    def __init__(self):
        self.title = "Mr Bond, si vous ne me donnez pas le code secret, je vais... "
        self.top1 = "Plus petite menace"
        self.top10 = "Plus grande menace"

    def __str__(self) -> str:
        return f"{self.title}\nTop 1 : {self.top1}\nTop 10 : {self.top10}"
