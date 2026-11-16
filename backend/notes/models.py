from django.db import models
from django.conf import settings

# Create your models here.


class Subject(models.Model):
    name = models.CharField(max_length=100)

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='subjects'
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class Category(models.Model):
    name = models.CharField(max_length=100)

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='categories'
    )


    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class Note(models.Model):

    title = models.CharField(max_length=200)
    content = models.TextField()

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='notes'
    )

    category = models.ForeignKey(
        Category,
        on_delete=models.SET_NULL,
        null = True,
        blank=True,
        related_name='notes'
    )

    subject = models.ForeignKey(
    Subject,
    on_delete=models.SET_NULL,
    null=True,
    blank=True,
    related_name='notes'
)

    is_pinned = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


    def __str__(self):
        return self.title


    